'use strict'


console.log('hello from node js');

var express = require("express");
const http = require('http');
const router = express("router");
const path = require("path");

var fs = require("fs");

const app = express();

var express = require("express");
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "cs348proj"
  });

app.use(express.static(__dirname + "/public"));

const signUp = app.use('/MainMenu', (req, res, next) => {
  console.log(req);
  //res.writeHeader(200, {"Content-Type: index"})
  res.sendFile(__dirname+"/public/MainMenu.html")
  //res.render("./public/MainMenu.html")
  
});

//router.get("/signup", signUp);

const sendIndex = app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
    
});

// con.connect(function(err) {
//   if (err) throw err;
  
// });



//router.get("/", sendIndex);



//module.exports = router;

app.listen(3000);


// con.query("SELECT employee_ID, name, employee_type, office_name FROM Employee_Info", function (err, result, fields) {
//   if (err) throw err;
//   console.log(result);
//   console.log(result[0].name);
//   res.send(result[0].name)
// });

  

//     var sql = "UPDATE Employee_Info SET employee_type = 'nurse' WHERE name = 'Aarushi'";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log(result.affectedRows + " record(s) updated");
//     });
//   });




