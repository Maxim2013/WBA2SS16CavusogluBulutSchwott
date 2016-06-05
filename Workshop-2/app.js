//exress und bodyParser einbinden
var express = require('express');
var bodyParser = require('body-parser');

//jsonParser anlegen (ist ein Teil der bodyParser und deswegen nicht mit require) und gibt einen Parser zurück, der mit Json-Daten arbeitet
var jsonParser = bodyParser.json();
//um mit express arbeiten zu können
var app = express();

// App benutzt JSON-Parser
app.use(bodyParser.json());

//interne Datenstruktur anlegen mit einfachen Objekten als Json-Format, damit man später über Push weitere Elemente annehmen kann
var equipment = [
    {
        "equipment_name": "Kamera"
    },
    {   "equipment_name": "Beleuchtung"
    },
    {    "equipment_name": "Ton"
    }
];



var user = [
     {
         "name":"Bulut",
         "vorname": "Esranur"
      },
      {    
         "name":"Cavusoglu",
         "vorname": "Aysenur"
      },
      {
         "name":"Schwott",
         "vorname": "Mark"
      }
];

console.log("Server läuft!");

//Ressource equipment anlegen, um Daten zurückzugeben (nur Json Daten, da der response nur Json zurückgibt)
app.get('/equipment', function (req, res){
    res.send(equipment);  
});


//Datenstruktur erweitern mit POST auch auf die Ressource equipment(in diesem Request soll ein JSON-Objekt übergeben werden, 
//deswegen parsen wir das Modul jsonParser)
app.post('/equipment', jsonParser, function (req, res){
      console.log ("Equipment anlegen");
     //Datenstruktur hinzufügen, durch jsonParser wird der body geparsed und auf die Daten in dem body kann man über diesen req.body Befehl zurückgreifen
    equipment.push(req.body);
    req.body;

    //res.send('Added!');
      console.log(equipment);

});

app.get('/user', function (req, res){
    res.send(user);
});


app.post('/user', jsonParser, function (req, res){
    console.log ("User anlegen");
    
    user.push(req.body);
    res.send("Added");

    console.log(user);
    });


app.listen(1337);
console.log('Server listens on port 1337');
