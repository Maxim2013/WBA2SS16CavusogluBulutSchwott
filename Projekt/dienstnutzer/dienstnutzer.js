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


//Kamerafunktion
app.get("/equipment/kameras", function(req, res){
    fs.readFile("./views/kameras.ejs", {encoding:"utf-8"}, function(err, filestring){
        if(err) {
            throw err;
            console.log("Fehler: Etwas ist schief gegangen");
        }
        else {
            var options = {
                host: "http://localhost/equipment/kameras",
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


//Beleuchtungsfunktion
app.get("/equipment/beleuchtung", function(req, res){
    fs.readFile("./views/beleuchtung.ejs", {encoding:"utf-8"}, function(err, filestring){
        if(err) {
            throw err;
            console.log("Fehler: Etwas ist schief gegangen");
        }
        else {
            var options = {
                host: "http://localhost/equipment/kameras",
                port: 3000,
                path: "/equipment/beleuchtung",
                method: "GET",
                headers : {
                    accept : "application/json"
                }
            }
            
            var externalRequest = http.request(options, function(externalResponse){
                console.log("Es wird nach Leuchtmitteln gesucht");
                externalResponse.on("data", function(chunk){
                    console.log(chunk);
                    var beleuchtung = JSON.parse(chunk);
                    console.log(beleuchtung);
                    var html = ejs.render(filestring, {beleuchtung: beleuchtung});
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


// Tonfunktion
app.get('/equipment/ton', function(req, res){

    fs.readFile('./ton.ejs', {encoding: 'utf-8'}, function(err, filestring){

        if (err) {
            throw err;
            console.log("Fehler: Etwas ist schief gegangen");
        } else 
{

            var options = {
                host: 'http://localhost/equipment/ton',
                port: 3000,
                path: '/equipment/ton',
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            }


        var externalRequest = request("http://localhost:3000/equipment/ton", function(err, httpResponse, body) {
            console.log('Verbunden');
                        
                console.log(body);
                var tondata = JSON.parse(body);
                console.log(tondata);
                var html = ejs.render(filestring,{ton:tondata});
                res.setHeader('content-type', 'text/html');
                res.writeHead(200);
                res.write(html);
                res.end();
                });

        externalRequest.end();
}

    });
});


app.get('/users', function(req, res){

    fs.readFile('./users.ejs', {encoding: 'utf-8'}, function(err, filestring){

        if (err) {
            throw err;
            console.log("Fehler: Etwas ist schief gegangen");
        } else 
{

            var options = {
                host: 'http://localhost/users',
                port: 3000,
                path: '/users',
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            }


        var externalRequest = request("http://localhost:3000/users", function(err, httpResponse, body) {
            console.log('Verbunden');
                        
                console.log(body);
                var userdata = JSON.parse(body);
                console.log(userdata);
                var html = ejs.render(filestring,{users:userdata});
                res.setHeader('content-type', 'text/html');
                res.writeHead(200);
                res.write(html);
                res.end();
                });

        externalRequest.end();
}

    });
});

app.listen(3001);
console.log("Listening on Port 3001");