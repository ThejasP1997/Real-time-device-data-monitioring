const fs = require('fs');
const http = require('http');
var mysql = require('mysql');
var url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
let app=express();


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  create_db();
});

app.get('/view', (req, res, next) => {
  console.log(req.url);
  res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
  });
  app.on('oninsert', data => {
    console.log("on get");
    res.write(`data: ${data["name"]},${data["id"]},${data["count"]}\n\n`);
  });
});

var i=0;
app.get('/insert', (req, res, next) => {
  console.log(req.url+"\n"+(i++));
  var url_parts = url.parse(req.url,true);
  //insert(url_parts.query.name,url_parts.query.id);
  app.emit('oninsert', {
            name: url_parts.query.name,
            id: url_parts.query.id,
            count: i
    });
    res.end();
})

app.listen(3001);
//create_db();

console.log("few lines of code to print in console");


//***************************************************************************************************************************************************
var myhost= "localhost",username="root",pwd="",db="postman";
function create_db()
{
    var con = mysql.createConnection({
    host: myhost,
    user: username,
    password: pwd,

  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE postman", function (err, result) {
      //if (err) throw err;
      console.log("Database created");
    });
  });
  con = mysql.createConnection({
    host: myhost,
    user:username,
    password: pwd,
    database: db
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("create table guru ("+
    "uid int NOT NULL AUTO_INCREMENT primary key,"+
    "id VARCHAR(100),"+
    "name VARCHAR(100)"+
    ");", function (err, result) {
      //if (err) throw err;
      console.log("table created");
    });
  });
}

function insert(id,name)
{
  var con = mysql.createConnection({
    host: myhost,
    user:username,
    password: pwd,
    database: db
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO guru (id, name) VALUES ('"+id+"', '"+name+"')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" record inserted");
    });
  });
}


function display(res)
{
  var str=pwd;
  var con = mysql.createConnection({
    host: myhost,
    user:username,
    password: pwd,
    database: db
  });

  con.connect(function(err) {
    //if (err) throw err;
    con.query("select * from guru order by id desc limit 10", function (err, result, fields) {
      //if (err) throw err;
      if(result!=null)
        for(var a=0;a<result.length;a++)
          str+=result[a].uid+" "+result[a].id+" "+result[a].name+"\n";
      else
        str="Empty";
      res.write("List:\n\n"+str);
      //res.end();
    });
  });
}
