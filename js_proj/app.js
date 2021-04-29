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
    password: "password",
    database: "cs348proj"
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
  
  con.query("INSERT INTO `Employee_Info` (`name`, `employee_type`, `office_name`) VALUES (\"" + name + "\", \"" + type + "\", \"" + office + "\")", function (err, result, fields) {
    if (err) throw err;
    //res.render('AddNewEmployee', {title: "Sign Up"})
  });

  con.query("SELECT employee_ID from `Employee_Info` WHERE name = \"" + name + "\" AND employee_type = \"" + type + "\" AND office_name = \"" + office + "\"", function (err, result, fields) {
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
  con.query("SELECT * FROM Basic_Patient_Info WHERE Patient_ID = " + id, function (err, result, fields) {
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
  
  con.query("UPDATE `Basic_Patient_Info` SET `name` = \"" + patient_name + "\", `age` = \"" + 
  patient_age + "\", `date_of_birth` = \"" + patient_DOB + "\", `gender` = \"" + patient_gender
  + "\", `phone_number` = \"" + patient_phone_num + "\", `address` = \"" + patient_address 
  + "\", `current_medication` = \"" + patient_curr_medication + "\", `underlying_health_condition` = \"" + patient_health_condition
  + "\", `insurance_ID` = " + patient_insurance + " WHERE `Patient_ID` = " + id, function (err, result, fields) {
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

  con.query("SELECT * FROM Basic_Patient_Info WHERE `Patient_ID` = " + id, function (err, result, fields) {
    if (err) throw err;
    res.render('showPatientInfo', {title: "Patient Information", data: result})
  });
});

app.delete('/patient/:id', (req, res) => {
  const { id } = req.params;
  con.query("DELETE FROM Basic_Patient_Info WHERE `Patient_ID` = " + id, function (err, result, fields) {
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
  
  con.query("INSERT INTO `Basic_Patient_Info` (`name`, `age`, `date_of_birth`, `gender`, `phone_number`, `address`, `current_medication`, `underlying_health_condition`, `insurance_ID`) VALUES (\"" + 
  patient_name + "\", \"" + patient_age +  "\", \"" + patient_DOB + "\", \"" + patient_gender + "\", \"" + patient_phone_num + "\", \"" + patient_address + "\", \"" + patient_health_condition + "\", \"" + patient_curr_medication + "\", \"" +  patient_insurance + "\")", function (err, result, fields) {
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

  con.query("SELECT name FROM Basic_Patient_Info WHERE `Patient_ID` = " + id, function (err, result, fields) {
    if (err) throw err;
    var name = result[0].name;
    res.render('AddToAppointmentTable', {title: "Add New Appointment", id, name})
  });
});

app.post('/AddToAppointmentTable', (req, res) => {
  console.log('AddToAppointmentTable')
  console.log(req.body)
  const {employee_ID, patient_ID, patient_name, date, time, symptoms, treatment, doctor_type} = req.body

  
  var datetime = date + "T" + time;
  // console.log(patient_gender)
  
  con.query("INSERT INTO `Appointments_Table` (`employee_ID`, `patient_ID`, `symptoms`, `treatment`, `appointment_time`, `doctor_type`) VALUES (\"" + 
  employee_ID + "\", \"" + patient_ID + "\", \"" + symptoms + "\", \"" + treatment + "\", " + datetime + ":00 , \"" + doctor_type + "\")", function (err, result, fields) {
    if (err) throw err;
    // res.render('AddNewPatient', {title: "Add New Patient", data: result})
    res.redirect('/MainMenu')
  });
  res.redirect('/MainMenu') // <-- change!!!!
});

// show
app.get('/patient/:id', (req, res) => {
  const { id } = req.params;
  console.log('in show')
  console.log("id " + id)
  console.log(req.params)
  // sql query to gather the information w that id

  con.query("SELECT * FROM Basic_Patient_Info WHERE `Patient_ID` = " + id, function (err, result, fields) {
    if (err) throw err;
    res.render('showPatientInfo', {title: "Patient Information", data: result})
  });
});

app.get('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration GET')
  res.render('PatientFilteration', {title: "Patient Filteration", data: null})
});

app.post('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration POST')

  const {name, patient_DOB} = req.body
  con.query("SELECT * FROM Basic_Patient_Info WHERE name = \"" + name + "\" AND date_of_birth = \"" + patient_DOB+"\"", function (err, result, fields) {
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
