'use strict'


var express = require("express");
const http = require('http');
const router = express("router");
const path = require("path");

var fs = require("fs");

const app = express();

var mysql = require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "portal"
  });

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  console.log('index')
  res.render('index', {title: "Login Page"})
});

app.get('/MainMenu', (req, res) => {
  console.log('mainmenu')
  res.render('MainMenu', {title: "Main Menu"})
});

app.get('/AddNewEmployee', (req, res) => {
  console.log('AddNewEmployee')
  res.render('AddNewEmployee', {title: "Sign Up"})
});


app.post('/AddNewEmployee', (req, res) => {
  console.log('AddNewEmployee')
  //console.log(req)
  const {name, username, password, type, office} = req.body

  var sql = "INSERT INTO `Employee_Info` (`name`, `employee_type`, `office_name`) VALUES (\"?\", \"?\", \"?\")";
  var inserts = [name, type, office];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    //res.render('AddNewEmployee', {title: "Sign Up"})
  });

  sql = "SELECT employee_ID from `Employee_Info` WHERE name = \"?\" AND employee_type = \"?\" AND office_name = \"?\"";
  inserts = [name, type, office];
  sql = mysql.format(sql, inserts);
  sql = sql.replace(/`/g, "");
  console.log(sql);
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].employee_ID)
    con.query("INSERT INTO `Login_Info` (`username`, `password`, `type_of_user`, `employee_ID`) VALUES (\"" + username + "\", \"" + password +  "\", \"" + type + "\", \"" + result[0].employee_ID + "\")", function (err2, result2, fields2) {
      if (err2) throw err2;
      res.render('AddNewEmployee', {title: "Sign Up"})
    });
  });

  // res.render('AddNewEmployee', {title: "Add New Employee"})
});

// khushi's code start //
// edit
app.get('/patient/:id/edit', (req, res) => {
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


  //res.send("made patch req")
  

})

// show
app.get('/patient/:id', (req, res) => {
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




app.get('/AddNewPatient', (req, res) => {
  console.log('AddNewPatient')
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
    res.redirect('/MainMenu')
  });
  //res.redirect('/MainMenu') // <-- change!!!!
});

app.get('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration GET')
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



//router.get("/signup", signUp);





// con.connect(function(err) {
//   if (err) throw err;
  
// });

//router.get("/", sendIndex);

//module.exports = router;

app.listen(3000);

// con.query("SELECT employee_ID, name, employee_type, office_name FROM Employee_Info", function (err, result, fields) {
//   if (err) throw err;
//   res.render('Patient Filteration', {data: result})
   
// });





//     var sql = "UPDATE Employee_Info SET employee_type = 'nurse' WHERE name = 'Aarushi'";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log(result.affectedRows + " record(s) updated");
//     });
//   });
