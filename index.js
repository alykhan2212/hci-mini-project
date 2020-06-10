const express = require("express");
const session = require("express-session");
const app = express();
const path = require('path');
const handlebars = require("express-handlebars");
const user_routers = require("./routers/user.js");

const bodyParser = require('body-parser');
const router = express.Router();
const session_options = {
  secret: "todo app secret",
  resave: false,
  saveUninitialized: true
};
app.use(session(session_options));
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""

});

con.connect();
con.query('CREATE DATABASE IF NOT EXISTS mydb', function (err) {
    if (err) throw err;
    else console.log("Database created");
    con.query('USE mydb', function (err) {
        if (err) throw err;
        con.query('CREATE TABLE IF NOT EXISTS users(id INT NOT NULL AUTO_INCREMENT,PRIMARY KEY(id),name VARCHAR(60),password VARCHAR(30))', function (err) {
                if (err) throw err;
            	else console.log('user table created');
            });
        con.query('CREATE TABLE IF NOT EXISTS bookmark(id INT NOT NULL AUTO_INCREMENT,PRIMARY KEY(id),title VARCHAR(60),link VARCHAR(250) ,username VARCHAR(60) )', function (err) {
                if (err) throw err;
            	else console.log('bookmark table created');
            });
    });
})

const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(session(session_options));

// Register handlebars view engine
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
// Use handlebars view engine
app.set("view engine", "handlebars");

app.get('/', function (req, res) {
    res.render('home');
});


 app.use(express.static("views"));

app.use("/user", user_routers);




app.listen(PORT, () => console.log({PORT}));


