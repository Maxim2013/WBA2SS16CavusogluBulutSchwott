// Module werden eingebunden
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var http = require('http');

// Starten der Redis Datenbank
var client = redis.createClient();

//jsonParser anlegen (ist ein Teil der bodyParser und deswegen nicht mit require) und gibt einen Parser zurück, der mit Json-Daten arbeitet
var jsonParser = bodyParser.json();

// In App werden die Methoden von Express eingebunden
var app = express();

// App benutzt JSON-Parser
app.use(bodyParser.json());


// Ressource: Kameras

app.get("/equipment/kameras", function AlleKamerasAusgeben(req, res){
    client.keys('kameras:*', function(err, rep){
        var kameras = [];

        if(rep.length == 0) {
            res.json(kameras);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               kameras.push(JSON.parse(val));
           });

            kameras = kameras.map(function(kameras){
        
                return {id: kameras.id, bezeichnung: kameras.bezeichnung, sensor: kameras.sensor, aufloesung: kameras.megapixel}; //Ein String
            });
            res.json(kameras);
        });
    });
});


app.post('/equipment/kameras', jsonParser, function (req, res){
      var newFotoCam = req.body;

        client.incr('id:kameras', function(err, rep){
            newFotoCam.id = rep;                                // eine id wird zugewiesen
            client.set('kameras:' + newFotoCam.id, JSON.stringify(newFotoCam), function(err, rep){
                res.json(newFotoCam);
            });
        });
    });



app.put('/equipment/kameras/:id', jsonParser, function KameraInfoBearbeiten (req, res) {
  client.del('kameras:'+req.params.id, function(err, rep){

        if (rep == 1) {
            var updatedCam = req.body;
            updatedCam.id = req.params.id;
            client.set('kameras:'+req.params.id, JSON.stringify(updatedCam), function(err, rep) {
                res.json(updatedCam);
            });

        }
        else {
            res.status(404).type('text').send('Die Kamera wurde nicht gefunden');
        }
    });
});


app.get('/equipment/kameras/:id', function kameraAusgeben(req, res){
     client.get('kameras:' + req.params.id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Die Kamera mit der ID " + req.params.id +  " ist nicht in der Datenbank");
        }
    });
});


app.delete('/equipment/equipment/kameras/:id', function (req, res) {
client.del('kameras:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Kamera mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});



// Ressource: Ton

app.get("/equipment/ton", function AlleTongeräteAusgeben(req, res){
    client.keys('ton:*', function(err, rep){
        var ton = [];

        if(rep.length == 0) {
            res.json(ton);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               ton.push(JSON.parse(val));
           });

            ton = ton.map(function(ton){
                return {id: ton.id, Equipment:ton.equipment, Name: ton.name, Merkmale: ton.merkmale, Länge: ton.länge, Nummer: ton.nummer};
            });
            res.json(ton);
        });
    });
});



app.post('/equipment/ton', jsonParser, function (req, res){
      var newTon = req.body;

        client.incr('id:ton', function(err, rep){
            newTon.id = rep;
            client.set('ton:' + newTon.id, JSON.stringify(newTon), function(err, rep){
                res.json(newTon);
            });
        });
    });


app.put('/equipment/ton/:id', jsonParser, function TonInfoBearbeiten (req, res) {
  client.del('ton:'+req.params.id, function(err, rep){

        if (rep == 1) { 
            var updatedTon = req.body;
            updatedTon.id = req.params.id;
            client.set('ton:'+req.params.id, JSON.stringify(updatedTon), function(err, rep) {
                res.json(updatedTon);
            });

        }
        else {
            res.status(404).type('text').send('Der Tonequipment wurde nicht gefunden');
        }
    });
});


app.get('/equipment/ton/:id', function kameraAusgeben(req, res){
     client.get('ton:' + req.params.id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Das Tonequipment mit der ID " + req.params.id +  " ist nicht in der Datenbank");
        }
    });
});


app.delete('/equipment/ton/:id', function (req, res) {
client.del('ton:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK' + req.params.id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Tonequipment mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});

// Ressource Beleuchtung

app.get("/equipment/beleuchtung", function AlleLeuchtgeräteAusgeben(req, res){
    client.keys('beleuchtung:*', function(err, rep){
        var beleuchtung = [];

        if(rep.length == 0) {
            res.json(bel);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               beleuchtung.push(JSON.parse(val));
           });

            beleuchtung = beleuchtung.map(function(beleuchtung){
                return {id: beleuchtung.id, Name: beleuchtung.name, Merkmale: beleuchtung.infos};
            });
            res.json(beleuchtung);
        });
    });
});


app.post('/equipment/beleuchtung', jsonParser, function (req, res){
      var newBel = req.body;

        client.incr('id:beleuchtung', function(err, rep){
            newBel.id = rep;                                            //Hier wird eine ID zugewiesen
            client.set('beleuchtung:' + newBel.id, JSON.stringify(newBel), function(err, rep){
                res.json(newBel);
            });
        });
    });


app.put('/equipment/beleuchtung/:id', jsonParser, function TonInfoBearbeiten (req, res) {
  client.del('beleuchtung:'+req.params.id, function(err, rep){

        if (rep == 1) { 
            var updatedBel = req.body;
            updatedBel.id = req.params.id;
            client.set('beleuchtung:' +req.params.id, JSON.stringify(updatedBel), function(err, rep) {
                res.json(updatedBel);
            });

        }
        else {
            res.status(404).type('text').send('Das Lichtequipment wurde nicht gefunden');
        }
    });
});


app.get('/equipment/beleuchtung/:id', function lichtgerätAusgeben(req, res){
     client.get('beleuchtung:' + req.params.id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Das Lichtquipment mit der ID " + req.params.id +  " ist nicht in der Datenbank");
        }
    });
});


app.delete('/equipment/beleuchtung/:id', function (req, res) {
client.del('beleuchtung:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Lichtquipment mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});



// Ressource: User


app.get("/users", function AlleUsersAusgeben(req, res){
    client.keys('users:*', function(err, rep){
        var users = [];

        if(rep.length == 0) {
            res.json(users);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               users.push(JSON.parse(val));
           });

            users = users.map(function(users){

                return {id: users.id, Name: users.name, Studiengang: users.studiengang, Semester: users.semester, Funktion: users.funktion};
            });
            res.json(users);
        });
    });
});


app.post('/users', jsonParser, function (req, res){
      var newUsr = req.body;

        client.incr('id:users', function(err, rep){
            newUsr.id = rep;                                //Hier wird eine ID zugewiesen
            client.set('users:' + newUsr.id, JSON.stringify(newUsr), function(err, rep){
                res.json(newUsr);
            });
        });
    });


app.put('/users/:id', jsonParser, function UserInfoBearbeiten (req, res) {
  client.del('users:'+req.params.id, function(err, rep){

        if (rep == 1) {UserInfoBearbeiten 
            var updatedUsr = req.body;
            updatedUsr.id = req.params.id;
            client.set('users:'+req.params.id, JSON.stringify(updatedUsr), function(err, rep) {
                res.json(updatedUsr);
            });

        }
        else {
            res.status(404).type('text').send('Der User wurde nicht gefunden');
        }
    });
});


app.delete('/users/:id', function (req, res) {
client.del('users:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Der User mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});


app.get('/users/:id', function userAusgeben(req, res){
     client.get('users:' + req.params.id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Der User mit der ID " + req.params.id +  " ist nicht in der Datenbank");
        }
    });
});


// Ab hier sind die Kommentare

app.get("/users/:id/kommentare", function AlleUserskommentareAusgeben(req, res){
    client.keys('users:*', function(err, rep){
        var userkom = [];

        if(rep.length == 0) {
            res.json(userkom);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               users.push(JSON.parse(val));
           });

            userkom = userkom.map(function(ton){
                return {id: users.id, Kommentar: users.kommentar};
            });
            res.json(users);
        });
    });
});


app.put('/users/:id/kommentare', jsonParser, function UserKommentarBearbeiten (req, res) {
  client.del('users:'+req.params.id, function(err, rep){

        if (rep == 1) { 
            var updatedUsr = req.body;
            //updatedUsr.id/kommentare = req.params.id/kommentare;
            client.set('users:'+req.params.id, JSON.stringify(updatedUsr), function(err, rep) {
                res.json(updatedUsr);
            });

        }
        else {
            res.status(404).type('text').send('Wurde nicht gefunden');
        }
    });
});


app.delete('/users/:id/kommentare', function (req, res) {
client.del('users:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Kommentar vom User mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});




// App läuft über Prot 3000
app.listen(3000);
console.log('Listening on http://localhost:3000');