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

app.get('/AddNewPatient', (req, res) => {
  console.log('AddNewPatient')
  res.render('AddNewPatient', {title: "Add New Patient", data: null})
});

app.post('/AddNewPatient', (req, res) => {
  console.log('AddNewPatient')
  console.log(req)
  const {name, gender, patient_DOB} = req.body
  // con.query("INSERT INTO `Basic_Patient_Info` (`patient_ID`, `name`, `age`, `date_of_birth`, `gender`, `phone_number`, `address`, `current_medication`, `underlying_health_condition`, `insurance_ID`) VALUES (" +
  // + 1250 + ", 'Bob', 21, '2000-12-20', 'male', 4087449840, '125 Sesame Street', 'percocet', 'Moderate pain', 1)" + name + "\" AND date_of_birth = \"" + patient_DOB+"\"", function (err, result, fields) {
  //   if (err) throw err;
  //   res.render('AddNewPatient', {title: "Add New Patient", data: result})
  // });

  res.render('AddNewPatient', {title: "Add New Patient"})
});

app.get('/AddToAppointmentTable', (req, res) => {
  console.log('AddToAppointmentTable')
  res.render('AddToAppointmentTable', {title: "Add New Appointment"})
});

app.get('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration GET')
  res.render('PatientFilteration', {title: "Patient Filteration", data: null})
});

app.post('/PatientFilteration', (req, res) => {
  console.log('PatientFilteration POST')
  console.log(req)
  const {name, patient_DOB} = req.body
  con.query("SELECT * FROM Basic_Patient_Info WHERE name = \"" + name + "\" AND date_of_birth = \"" + patient_DOB+"\"", function (err, result, fields) {
    if (err) throw err;
    res.render('PatientFilteration', {title: "Patient Filteration", data: result})
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
