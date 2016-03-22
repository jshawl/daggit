#! /usr/bin/env node

var util = require('util')
var express = require("express");
var app = express();
app.set("view engine", "hbs")
app.set('views', __dirname + '/views');

var exec = require('child_process').execSync;
var Convert = require('ansi-to-html');
var convert = new Convert();

app.get("/", function(req, res){
  res.render("index", {log: log(), diff: diff()})
})

app.get("/:sha", function(req, res){
  res.render("index", {log: log(req.params.sha), diff: diff(req.params.sha)})
})

function log(reqsha){
  var l = exec("git log -n 30 --all --oneline --graph --decorate --color=always",{encoding: 'utf8'})
  var html = convert.toHtml(l);
  return html.replace(/>([a-z0-9]+)</g,function(sha){
    var sha = sha.replace(/(<|>)/g,"")
    var str = "><a "
    if(reqsha == sha){
      str += "class='active' "
    }
    str += "href='/"+sha+"'>" +sha+ "</a><"
    return str
  })
}

function diff(sha){
  var sha = sha || "HEAD"
  var d = exec("git show "+sha+" --color=always",{encoding: 'utf8'});
  d = d.replace(/</g,"&lt;")
  return convert.toHtml(d);
}

app.listen(3000, function(){
  console.log("listening on http://localhost:3000/")
})