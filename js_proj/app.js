'use strict'


var express = require("express");
const http = require('http');
const router = express("router");
const path = require("path");
const session = require("express-session");

var fs = require("fs");

const app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "portal",
    multipleStatements: true
  });

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(session({secret: 'notsignedin'}))

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  console.log('index')
  res.render('index', {title: "Login Page"})
});

app.post('/login', (req, res) => {
  console.log("login");
  const {username, password} = req.body;
  console.log(req.body);

  var sql = "SELECT * FROM Login_info WHERE username = ?";
  var inserts = [username];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    console.log(result[0].password);
    if (result[0].password === password) {
      req.session.user_id = result[0].employee_ID;
      res.redirect("/MainMenu")
    }
    else {
      res.redirect('/')
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  console.log("in logout")
  console.log(req.session.user_id);
  res.redirect("/");
});

app.get('/MainMenu', (req, res) => {
  console.log('mainmenu')
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render('MainMenu', {title: "Main Menu", employee_id: req.session.user_id})
});

app.get('/AddNewEmployee', (req, res) => {
  console.log('AddNewEmployee')
  res.render('AddNewEmployee', {title: "Sign Up"})
});


app.post('/AddNewEmployee', (req, res) => {
  console.log('AddNewEmployee')
  //console.log(req)
  const {name, username, password, type, office} = req.body

  var sql = "INSERT INTO `Employee_Info` (`name`, `employee_type`, `office_name`) VALUES (?, ?, ?)";
  var inserts = [name, type, office];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    //res.render('AddNewEmployee', {title: "Sign Up"})
  });

  sql = "SELECT employee_ID from `Employee_Info` WHERE name = ? AND employee_type = ? AND office_name = ?";
  inserts = [name, type, office];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].employee_ID)
    req.session.user_id = result[0].employee_ID;

    sql = "INSERT INTO `Login_Info` (`username`, `password`, `type_of_user`, `employee_ID`) VALUES (?, ?, ?, ?)";
    inserts = [username, password, type, result[0].employee_ID];
    sql = mysql.format(sql, inserts);
    sql = sql.replace(/`/g, "");
    console.log(sql);

    con.query(sql , function (err2, result2, fields2) {
      if (err2) throw err2;
      //res.render('AddNewEmployee', {title: "Sign Up"})
      res.redirect('/MainMenu');
    });
  });

  // res.render('AddNewEmployee', {title: "Add New Employee"})
});

// khushi's code start //
// edit
app.get('/patient/:id/edit', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  const { id } = req.params;
  // sql query to gather the information w that id
  var sql = "SELECT * FROM Basic_Patient_Info WHERE Patient_ID = ?";
  var inserts = [id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    //res.render('PatientFilteration', {title: "Patient Filteration", data: result})
    res.render('editPatientInfo', { title: "Edit Patient Info", patient: result })
  });
});

// update
app.patch('/patient/:id', (req, res) => {
  console.log(req.body)

  const { id } = req.params;
  const {patient_name, patient_gender, patient_age, patient_DOB, patient_phone_num, patient_address, patient_insurance, patient_insurance_type, patient_curr_medication, patient_health_condition} = req.body
  
  var sql = "UPDATE `Basic_Patient_Info` SET `name` = ?, `age` = ?, `date_of_birth` = ?, `gender` = ?, `phone_number` = ?, `address` = ?, `current_medication` = ?, `underlying_health_condition` = ?, `insurance_ID` = ? WHERE `Patient_ID` = ?";
  var inserts = [patient_name, patient_age, patient_DOB, patient_gender, patient_phone_num, patient_address, patient_curr_medication, patient_health_condition, patient_insurance, id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result)
    console.log('in patch')
    console.log("id " + id)
    res.redirect('/patient/'+id)
  });
})

// show
app.get('/patient/:id', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  const { id } = req.params;
  console.log('in show')
  console.log("id " + id)
  console.log(req.params)
  // sql query to gather the information w that id

  var sql = "SELECT * FROM Basic_Patient_Info WHERE `Patient_ID` = ?";
  var inserts = [id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('showPatientInfo', {title: "Patient Information", data: result})
  });
});

app.delete('/patient/:id', (req, res) => {
  const { id } = req.params;

  var sql = "DELETE FROM Basic_Patient_Info WHERE `Patient_ID` = ?";
  var inserts = [id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.redirect('/MainMenu')
  });
  // sql query to delete row w that id from Basic Patient Info
});

// khushi's code end //

// employee code //
app.get('/employee/:id', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  const { id } = req.params;
  // sql query to gather the information w that id
  var sql = "SELECT * FROM Employee_Info WHERE employee_ID = ?";
  var inserts = [id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('viewEmployee', { title: "View Employee Profile", employee: result })
  });
});

// end employee code //


app.get('/AddNewPatient', (req, res) => {
  console.log('AddNewPatient')
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render('AddNewPatient', {title: "Add New Patient", data: null})
});

app.post('/AddNewPatient', (req, res) => {
  console.log('AddNewPatient')
  console.log(req)
  const {patient_name, patient_gender, patient_age, patient_DOB, patient_phone_num, patient_address, patient_insurance, patient_insurance_type, patient_curr_medication, patient_health_condition} = req.body

  // console.log(patient_gender)
  
  var sql = "INSERT INTO `Basic_Patient_Info` (`name`, `age`, `date_of_birth`, `gender`, `phone_number`, `address`, `current_medication`, `underlying_health_condition`, `insurance_ID`) VALUES (\"?\", \"?\", \"?\", \"?\", \"?\", \"?\", \"?\", \"?\", \"?\")";
  var inserts = [patient_name, patient_age, patient_DOB, patient_gender, patient_phone_num, patient_address, patient_health_condition, patient_curr_medication, patient_insurance];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    // res.render('AddNewPatient', {title: "Add New Patient", data: result})
    res.redirect('/MainMenu')
  });

  // con.query("INSERT INTO `Insurance` (`type`, `company_name`) VALUES (\"" + patient_insurance_type + "\", \"" + patient_insurance +  "\")", function (err2, result2, fields2) {
  //   if (err2) throw err2;
  // });

  //res.render('AddNewPatient', {title: "Add New Patient"})
});

app.get('/AddToAppointmentTable/:id/add', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  const { id } = req.params;
  console.log('AddToAppointmentTable')

  var sql = "SELECT name FROM Basic_Patient_Info WHERE `Patient_ID` = ?";
  var inserts = [id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    var name = result[0].name;
    res.render('AddToAppointmentTable', {title: "Add New Appointment", id, name})
  });
});

app.post('/AddToAppointmentTable', (req, res) => {
  console.log('AddToAppointmentTable')
  console.log(req.body)
  const {employee_ID, patient_ID, patient_name, date, time, symptoms, treatment, doctor_type} = req.body
  
  var datetime = date + "T" + time+":00";
  // console.log(patient_gender)
  
  var sql = "INSERT INTO `Appointments_Table` (`employee_ID`, `patient_ID`, `symptoms`, `treatment`, `appointment_time`, `doctor_type`) VALUES (?, ?, ?, ?, ? , ?)";
  var inserts = [employee_ID, patient_ID, symptoms, treatment, datetime, doctor_type];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    // res.render('AddNewPatient', {title: "Add New Patient", data: result})
    res.redirect('/ViewAppointments/' + patient_ID)
  });
  //res.redirect('/MainMenu') // <-- change!!!!
});

app.get('/ViewAppointments/:id', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  const { id } = req.params;
  console.log('View Appointments')

  var sql = "SELECT * FROM Appointments_Table WHERE `Patient_ID` = ?";
  var inserts = [id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.render('ViewAppointments', {title: "View Patient's Past Appointments", data: result})
  });
});

app.get('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration GET')
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render('PatientFilteration', {title: "Patient Filteration", data: null})
});

app.post('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration POST')

  const {name, patient_DOB} = req.body

  console.log(name);
  console.log(patient_DOB);

  var sql = "SELECT * FROM Basic_Patient_Info WHERE name = \""+ "??" + "\" AND date_of_birth = \"" + "??" + "\"";
  var inserts = [name, patient_DOB];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('showPatientInfo', {title: "Patient Info", data: result})
  });
});

// Bob 2000-12-20

app.get('/TablesToEdit', (req, res) => {
  console.log('TablesToEdit')
  res.render('TablesToEdit', {title: "Edit Patient Info"})
});

app.get('/Stat', (req, res) => {
  console.log('Stat')
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render('Stat', {title: "Stats Page"})
});

app.get('/StatEmployee', (req, res) => {
  console.log('StatEmployee')
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: null})
});

app.get('/StatPatient', (req, res) => {
  console.log('StatPatient')
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render('Stat_Patient', {title: "Stats Patient Page",  list_by_gender: null, list_by_age: null, patients_with_most_appts: null, most_common_illnesses: null})
});


app.post('/StatPatient_ListByGender', (req, res) => {
  console.log('StatPatient_ListByGender')

  const {gender} = req.body
  var sql = "CALL retPatients(\"??\", @out_total); SELECT @out_total as output;";
  var inserts = [gender];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('Stat_Patient', {title: "Stats Patient Page",  list_by_gender: result[1][0].output, list_by_age: null, patients_with_most_appts: null, most_common_illnesses: null})
  });
  
});

app.post('/StatPatient_ListByAge', (req, res) => {
  console.log('StatPatient_ListByAge')

  const {low_age, high_age} = req.body

  var sql = "CALL patientsInRange(??, ??, @out_total); SELECT @out_total as output;";
  var inserts = [low_age, high_age];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('Stat_Patient', {title: "Stats Patient Page",  list_by_gender: null, list_by_age: result[1][0].output, patients_with_most_appts: null, most_common_illnesses: null})
  });
});

app.post('/StatPatient_MostAppts', (req, res) => {
  console.log('StatPatient_MostAppts')

  var sql = "select Basic_Patient_Info.name, count(Appointments_Table.Patient_ID) as cnt from Appointments_Table join Basic_Patient_Info where Appointments_Table.Patient_ID = Basic_Patient_Info.Patient_ID group by Appointments_Table.Patient_ID having count(Appointments_Table.Patient_ID) >= (select max(a.cnt) from (select count(patient_ID) as cnt from Appointments_Table group by patient_ID) as a);";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('Stat_Patient', {title: "Stats Patient Page",  list_by_gender: null, list_by_age: null, patients_with_most_appts: result[0], most_common_illnesses: null})
  });
});

app.post('/StatPatient_CommonIll', (req, res) => {
  console.log('StatPatient_CommonIll')

  var sql = "select symptoms, count(symptoms) as cnt from Appointments_Table group by symptoms having count(symptoms) >= (select max(a.cnt) from (select count(symptoms) as cnt from Appointments_Table group by symptoms) as a);";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('Stat_Patient', {title: "Stats Patient Page",  list_by_gender: null, list_by_age: null, patients_with_most_appts: null, most_common_illnesses: result[0]})
  });
});

    
app.post('/StatEmployee_ExpWith', (req, res) => {
  console.log('/StatEmployee_ExpWith')

  const {specialty} = req.body

  var sql = "CALL getDocType(\"??\", @out_total); SELECT @out_total as output;";
  var inserts = [specialty];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result[1])
    res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: result[1][0].output, doc_with_most_appointments: null, doc_with_most_accesses: null})
  });
  
});


app.post('/StatEmployee_NumEmployees', (req, res) => {
  console.log('/StatEmployee_NumEmployees')

  const {dept_name} = req.body

  var sql = "CALL getDeptNum(\"??\", @out_total); SELECT @out_total as output;";
  var inserts = [dept_name];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: result[1][0].output, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: null})
  });
});

// app.post('/StatEmployee_MostAppts', (req, res) => {
//   console.log('StatPatient_MostAppts')

//   var sql = "";
//   con.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: null})
//   });
// });

// app.post('/StatEmployee_MostAccesses', (req, res) => {
//   console.log('StatEmployee_MostAccesses')

//   var sql = "";
//   con.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: null})
//   });
// });


app.listen(3000);
