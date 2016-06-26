var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var http = require("http");

var app = express();
var server = http.createServer(app);


app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));


//Beim Aufruf der Route "/" wird die Index Seite aufgerufen
app.get("/", function(req, res){
    res.render('index.ejs');
});


//Kamera -- Funktionen BEGINN
app.get("/kameras", function(req, res){
    fs.readFile("./views/kameras.ejs", {encoding:"utf-8"}, function(err, filestring){
        if(err) {
            throw err;
            console.log("Etwas ist schief gegangen");
        }
        else {
            var options = {
                host: "localhost",
                port: 3000,
                path: "/equipment/kameras",
                method: "GET",
                headers : {
                    accept : "application/json"
                }
            }
            
            var externalRequest = http.request(options, function(externalResponse){
                console.log("Es wird nach Kameras gesucht");
                externalResponse.on("data", function(chunk){
                    console.log(chunk);
                    var kameras = JSON.parse(chunk);
                    console.log(kameras);
                    var html = ejs.render(filestring, {kameras: kameras});
                    res.setHeader("content-type", "text/html");
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }        
    });
});

app.get("/postkamera", function(req, res){
    res.render('postkamera.ejs');
});

app.post('/postkamera', function(req, res){
    console.log("Methode /postkamera wurde aufgerufen")
    var newKamera = req.body;
    console.log(req.body);
    console.log(newKamera);
   fs.readFile("./views/postkamera.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/equipment/kameras",
        method:"POST"
      }
        var externalRequest = http.request(options, function(externalResponse){
        console.log("Mit dem Server verbunden -- Port 3000 -- Path : /users -- Methode : POST");
                    externalResponse.on("data", function(chunk){
                    newUser = JSON.parse(chunk);
                    var html = ejs.render(filestring, {newKamera: newKamera, filename: __dirname + '/views/postkamera.ejs'});
                    res.setHeader("content-type", "text/html");
                    res.writeHead(200);
                    res.write(html);
                    res.end();
});
});
externalRequest.on('error', function(e) {
            console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(req.body));
      externalRequest.end();
    }
});
});


// Funktionene für Ausleihe Beginn

app.get("/postequipment", function(req, res){
    res.render('postequipment.ejs');
});

app.listen(3001);
console.log("Listen on Port 3001");