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


app.get("/insert",function(req,res){
  console.log(req.url);
  var url_parts = url.parse(req.url,true);
  insert(url_parts.query.name,url_parts.query.id);
  res.json({"message":"get successful"});
});
app.get("/view",function(req,res){
  console.log(req.url);
  var url_parts = url.parse(req.url,true);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  display(res);
});
app.listen(3001);

console.log("few lines of code to print in console");


//***************************************************************************************************************************************************
var myhost= "localhost",username="root",pwd="",db="postman";
function create_db()
{
    var con = mysql.createConnection({
    host: myhost,
    user:username,
    password: pwd
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
  /*    //if (err) throw err;
      if(result!=null)
        for(var a=0;a<result.length;a++)
          str+=result[a].uid+" "+result[a].id+" "+result[a].name+"\n";
      else
        str="Empty";
        res.write("List:\n\n"+str);
         */
        if(result!=null){
        //  for(var a=0;a<result.length;a++)
          //  str+=result[a].uid+" "+result[a].id+" //"+result[a].name+"\n";
            res.write("<table>"); /*
            res.write("<tr>");
            for(var column in result[0]){
                res.write("<td><label>" + column + "</label></td>");
            }
            res.write("</tr>"); */
            for(var row in result){
                res.write("<tr>");
                for(var column in result[row]){
                    res.write("<td><label>" + result[row][column] + "</label></td>");
                }
                res.write("</tr>");
            }
            res.write("</table>");
}
        else
          str="Empty";
      //res.write("List:\n\n"+str);
      res.end();
    });
  });
}
