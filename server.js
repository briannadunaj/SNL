var express = require("express");
var mysql = require("mysql");

var app = express();

var port = 3000;

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "snl"
});

connection.connect(function(err){
	if (err){
		console.log("error connecting: " + err.stack);
		return;
	}

	console.log("connected as id " + connection.threadId);
	app.listen(port, function(){
		console.log("EXPRESS APP LISTENING");
	});
});