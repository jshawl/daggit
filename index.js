var util = require('util')
var express = require("express");
var app = express();
app.set("view engine", "hbs")
var exec = require('child_process').execSync;
var Convert = require('ansi-to-html');
var convert = new Convert();


app.get("/", function(req, res){
  var log = exec("git log --all --oneline --graph --decorate --color=always",{encoding: 'utf8'})
  var html = convert.toHtml(log);
  html = html.replace(/>([a-z0-9]+)</g,function(sha){
    var sha = sha.replace(/(<|>)/g,"")
    return "><a href='/"+sha+"'>" +sha+ "</a><"
  })
  var diff = exec("git show HEAD --color=always",{encoding: 'utf8'})
  diff = convert.toHtml(diff);
  res.render("index", {log: html, diff: diff})
})

app.get("/:sha", function(req, res){
  var log = exec("git log --all --oneline --graph --decorate --color=always",{encoding: 'utf8'})
  var html = convert.toHtml(log);
  html = html.replace(/>([a-z0-9]+)</g,function(sha){
    var sha = sha.replace(/(<|>)/g,"")
    return "><a href='/"+sha+"'>" +sha+ "</a><"
  })
  var diff = exec("git show "+req.params.sha+" --color=always",{encoding: 'utf8'})
  diff = convert.toHtml(diff);
  res.render("index", {log: html, diff: diff})
})

app.listen(3000)