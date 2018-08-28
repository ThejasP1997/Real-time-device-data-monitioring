const fs = require('fs');
const http = require('http');
var url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
let app=express();


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
  app.emit('oninsert', { 
            name: url_parts.query.name,
            id: url_parts.query.id,
            count: i
    });
    res.end();
})

app.listen(3001);