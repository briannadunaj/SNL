var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");

var app = express();
var port = process.env.port || 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

var exphbs = require("express-handlebars");

app.engine ("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "snl"
});

/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));
*/

app.get("/", function(req, res){
	connection.query("SELECT * FROM `title` JOIN `episode` WHERE `title`.`sid` = `episode`.`sid` AND `title`.`eid` = `episode`.`eid` ORDER BY `title`.`sid` DESC, `title`.`eid` DESC; ;",
	 function(err, data){
		if (err) {
			throw err;
		}

		res.render("index", {title: data, episode: data});
	});
});

app.get("/:season", function(req, res){
	connection.query("SELECT * FROM `title` JOIN `episode` WHERE `title`.`sid` = `episode`.`sid` AND `title`.`eid` = `episode`.`eid` WHERE `sid` = ?", [req.params.season],
	 function(err, data){
		if (err){
			throw err;
		}

		res.redirect("index", {title: data, episode: data});
	})
})

app.get("/episode", function(req, res){
	connection.query("SELECT * FROM `episode` ORDER BY `sid`;",
		function(err, result){
			//var resultsString = JSON.stringify(result);
			var html = "<h1>Episodes ordered by season number </h1>";
			html += "<ul>";

			for (var i = 0; i < result.length; i++){
				html += "<li><p> Episode: " +  result[i].eid + "</p>";
				html += "<p> Season: " + result[i].sid + "</p>";
				html += "<p> Aired on: " + result[i].aired + "</p>";
				html += "<p> Host: " + result[i].host + "</p></li>"
			}
			
			html += "</ul>";

			res.send(html);
		});
});

app.get("/season/:sid", function(req, res) {
	connection.query("SELECT * FROM `season` WHERE `sid` = ?", [req.params.sid],
	 function(error, result){
		//var html = "<!doctype html><html>";
		var html = "<h1>Search results for season " + req.params.sid  + "</h1>";
		html += "<ul>";

		for (var i = 0; i < result.length; i++){
			html+= "<li><p> Episode: " + result[i].eid + "</p>";
			html += "<p> Host: " + result[i].host + "</p></li>";
		}

		html += "</ul>";


		res.send(html);
	});
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