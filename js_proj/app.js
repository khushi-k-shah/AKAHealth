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
<<<<<<< HEAD
    password: "stock123",
    database: "portal",
=======
    password: "password",
    database: "cs348proj",
>>>>>>> e696f7ba6650ba5198c5d8e5008f14454e7fbdab
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
  } else {
    res.render('MainMenu', {title: "Main Menu", employee_id: req.session.user_id})
  }
});

app.get('/AddNewEmployee', (req, res) => {
  console.log('AddNewEmployee')
  res.render('AddNewEmployee', {title: "Sign Up"})
});


app.post('/AddNewEmployee', (req, res) => {
  console.log('AddNewEmployee')
  //console.log(req)
  const {name, username, password, type, office} = req.body

  var sql = "BEGIN; INSERT INTO `Employee_Info` (`name`, `employee_type`, `office_name`) VALUES (?, ?, ?); COMMIT;";
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

    sql = "BEGIN; INSERT INTO `Login_Info` (`username`, `password`, `type_of_user`, `employee_ID`) VALUES (?, ?, ?, ?); COMMIT;";
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
    return;
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
  
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sql = "INSERT INTO `Employee_Accesses` (`access_time`, `access_type`, `employee_ID`, `patient_ID`) VALUES (?, ?, ?, ?)";
  var inserts = [dateTime, "update", req.session.user_id, id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql , function (err2, result2, fields2) {
    if (err2) throw err2;
  });

  sql = "BEGIN; UPDATE `Basic_Patient_Info` SET `name` = ?, `age` = ?, `date_of_birth` = ?, `gender` = ?, `phone_number` = ?, `address` = ?, `current_medication` = ?, `underlying_health_condition` = ?, `insurance_ID` = ? WHERE `Patient_ID` = ?; COMMIT;";
  inserts = [patient_name, patient_age, patient_DOB, patient_gender, patient_phone_num, patient_address, patient_curr_medication, patient_health_condition, patient_insurance, id];
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
    return;
  }
  const { id } = req.params;
  console.log('in show')
  console.log("id " + id)
  console.log(req.params)

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sql = "INSERT INTO `Employee_Accesses` (`access_time`, `access_type`, `employee_ID`, `patient_ID`) VALUES (?, ?, ?, ?)";
  var inserts = [dateTime, "view", req.session.user_id, id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql , function (err2, result2, fields2) {
    if (err2) throw err2;
  });

  // sql query to gather the information w that id

  sql = "SELECT * FROM Basic_Patient_Info WHERE `Patient_ID` = ?";
  inserts = [id];
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

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sql = "INSERT INTO `Employee_Accesses` (`access_time`, `access_type`, `employee_ID`, `patient_ID`) VALUES (?, ?, ?, ?)";
  var inserts = [dateTime, "delete", req.session.user_id, id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql , function (err2, result2, fields2) {
    if (err2) throw err2;
  });

  sql = "DELETE FROM Basic_Patient_Info WHERE `Patient_ID` = ?";
  inserts = [id];
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
    return;
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
  } else {
    res.render('AddNewPatient', {title: "Add New Patient", data: null})
  }
});

app.post('/AddNewPatient', (req, res) => {
  console.log('AddNewPatient')
  console.log(req)
  const {patient_name, patient_gender, patient_age, patient_DOB, patient_phone_num, patient_address, patient_insurance, patient_insurance_type, patient_curr_medication, patient_health_condition} = req.body

  // console.log(patient_gender)
  
  var sql = "BEGIN; INSERT INTO `Basic_Patient_Info` (`name`, `age`, `date_of_birth`, `gender`, `phone_number`, `address`, `current_medication`, `underlying_health_condition`, `insurance_ID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); COMMIT;";
  var inserts = [patient_name, patient_age, patient_DOB, patient_gender, patient_phone_num, patient_address, patient_health_condition, patient_curr_medication, patient_insurance];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    // res.render('AddNewPatient', {title: "Add New Patient", data: result})
    
    var sql2 = "SELECT patient_ID FROM Basic_Patient_Info WHERE `name` = ? AND `date_of_birth` = ? AND `phone_number` = ? AND `address` = ?";
    var inserts2 = [patient_name, patient_DOB, patient_phone_num, patient_address];
    sql2 = mysql.format(sql2, inserts2);
    sql2 = sql2.replace(/`/g, "");
    console.log(sql2);
    
    con.query(sql2, function (err2, result2, fields2) {
      if (err2) throw err2;

      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      var sql3 = "INSERT INTO `Employee_Accesses` (`access_time`, `access_type`, `employee_ID`, `patient_ID`) VALUES (?, ?, ?, ?)";
      var inserts3 = [dateTime, "insert", req.session.user_id, result2[0].patient_ID];
      sql3 = mysql.format(sql3, inserts3);
      sql3 = sql3.replace(/`/g, "");
      console.log(sql3);

      con.query(sql3 , function (err3, result3, fields3) {
        if (err3) throw err3;
      });
    });

    // res.redirect('/MainMenu')
  });

  var insurance_name = ""
  var type = ""
  if (patient_insurance < 1000) {
    insurance_name = "Cigna"
    type = "Health"
  } else if (patient_insurance < 2000) {
    insurance_name = "United"
    type = "Health"
  } else {
    insurance_name = "Aetna"
    type = "Dental"
  }

  var sql2 = "BEGIN; INSERT INTO `Insurance` (`insurance_ID`, `type`, `company_name`) VALUES (?, ?, ?); COMMIT;";
  var inserts2 = [patient_insurance, type, insurance_name];
  sql2 = mysql.format(sql2, inserts2);
  sql2 = sql2.replace(/`/g, "");
  console.log(sql2);

  con.query(sql2, function (err2, result2, fields2) {
    if (err2) throw err2;
    res.redirect('/MainMenu')
  });

  //res.render('AddNewPatient', {title: "Add New Patient"})
});

app.get('/AddToAppointmentTable/:id/add', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
    return;
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
    res.render('AddToAppointmentTable', {title: "Add New Appointment", id, name, employee_id: req.session.user_id})
  });
});

app.post('/AddToAppointmentTable', (req, res) => {
  console.log('AddToAppointmentTable')
  console.log(req.body)
  const {employee_ID, patient_ID, patient_name, date, time, symptoms, treatment, doctor_type} = req.body
  
  var datetime = date + "T" + time+":00";
  // console.log(patient_gender)

  var today = new Date();
  var current_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var current_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var current_dateTime = current_date +' '+ current_time;

  var sql = "INSERT INTO `Employee_Accesses` (`access_time`, `access_type`, `employee_ID`, `patient_ID`) VALUES (?, ?, ?, ?)";
  var inserts = [current_dateTime, "insert", req.session.user_id, patient_ID];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql , function (err2, result2, fields2) {
    if (err2) throw err2;
  });
  
  sql = "BEGIN; INSERT INTO `Appointments_Table` (`employee_ID`, `patient_ID`, `symptoms`, `treatment`, `appointment_time`, `doctor_type`) VALUES (?, ?, ?, ?, ? , ?); COMMIT;";
  inserts = [employee_ID, patient_ID, symptoms, treatment, datetime, doctor_type];
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
    return;
  }
  const { id } = req.params;
  console.log('View Appointments')

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sql = "INSERT INTO `Employee_Accesses` (`access_time`, `access_type`, `employee_ID`, `patient_ID`) VALUES (?, ?, ?, ?)";
  var inserts = [dateTime, "view", req.session.user_id, id];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql , function (err2, result2, fields2) {
    if (err2) throw err2;
  });

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
    return;
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

// app.get('/TablesToEdit', (req, res) => {
//   console.log('TablesToEdit')
//   res.render('TablesToEdit', {title: "Edit Patient Info"})
// });

app.get('/Stat', (req, res) => {
  console.log('Stat')
  if (!req.session.user_id) {
    res.redirect("/")
    return;
  }
  res.render('Stat', {title: "Stats Page"})
});

app.get('/StatEmployee', (req, res) => {
  console.log('StatEmployee')
  if (!req.session.user_id) {
    res.redirect("/")
    return;
  }
  res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: null})
});

app.get('/StatPatient', (req, res) => {
  console.log('StatPatient')
  if (!req.session.user_id) {
    res.redirect("/")
    return;
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

  console.log(req.body)
  console.log(specialty)

  var out_total = "";

  var sql = "CALL getDocType(\"??\", @out_total); SELECT @out_total as output;";
  var inserts = [specialty];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(out_total)
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
  console.log(sql);

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result[1])
    res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: result[1][0].output, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: null})
  });
});

app.post('/StatEmployee_MostAppts', (req, res) => {
  console.log('StatPatient_MostAppts')

  var sql = "SELECT e.name as name from Employee_info e, Appointments_Table a WHERE a.employee_ID = e.employee_ID GROUP BY e.employee_ID HAVING count(a.employee_ID) = (Select MAX(cnt) from (SELECT count(employee_ID) as cnt from Appointments_Table group by employee_ID) tb);";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result)
    res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: null, doc_with_most_appointments: result[0].name, doc_with_most_accesses: null})
  });
});

app.post('/StatEmployee_MostAccesses', (req, res) => {
  console.log('StatEmployee_MostAccesses')

  var sql = "SELECT e.name as name from Employee_info e, Employee_Accesses a WHERE a.employee_ID = e.employee_ID GROUP BY e.employee_ID HAVING count(a.employee_ID) = (Select MAX(cnt) from (SELECT count(employee_ID) as cnt from Employee_Accesses group by employee_ID) tb);";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result)
    res.render('Stat_Employee', {title: "Stats Employee Page", num_employees: null, exp: null, doc_with_most_appointments: null, doc_with_most_accesses: result[0].name})
  });
});


app.listen(3000);