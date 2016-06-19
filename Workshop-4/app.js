// Module werden eingebunden
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var http = require('http');

// Starten der Redis Datenbank
var db = redis.createClient();

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
                return;
                //return {kameras/:id: kameras.id, bezeichnung: kameras.bezeichnung, sensor: kameras.sensor, auflösung: kameras.megapixel};
            });
            res.json(kamera);
        });
    });
});


app.post('/equipment/kameras', jsonParser, function (req, res){
      var newFotoCam = req.body;

        client.incr('kameras:kameras', function(err, rep){
            newFotoCam.kameras = rep;
            client.set('kameras:' + newFotoCam.kameras, JSON.stringify(newFotoCam), function(err, rep){
                res.json(newfotoCam);
            });
        });
    });


/*app.put('/equipment/kameras/:id', function (req, res) {
  res.send('Kamera aktualisiert');
}); */

app.put('/equipment/kameras/:id', function KameraInfoBearbeiten (req, res) {
  client.del('kameras:'+req.params.kameras/:id, function(err, rep){

        if (rep == 1) {KameraInfoBearbeiten 
            var updatedCam = req.body;
            updatedCam.kameras/:id = req.params.kameras/:id;
            client.set('kameras:'+req.params.kameras/:id, JSON.stringify(updatedCam), function(err, rep) {
                res.json(updatedCam);
            });

        }
        else {
            res.status(404).type('text').send('Die Kamera wurde nicht gefunden');
        }
    });
});


app.get('/equipment/equipment/kameras/:id', function kameraAusgeben(req, res){
     client.get('kameras:' + req.params.kameras/:id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Die Kamera mit der ID " + req.params.kameras/:id +  " ist nicht in der Datenbank");
        }
    });
});


app.delete('/equipment/equipment/kameras/:id', function (req, res) {
client.del('kameras:'+req.params.kameras/:id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.kameras/:id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Kamera mit der ID ' + req.params.kameras/:id + ' wurde nicht gefunden');
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
               kameras.push(JSON.parse(val));
           });

            ton = ton.map(function(ton){
                return {ton/:id: ton.id, Name: ton.name, Merkmale: ton.merkmale, Länge: ton.länge};
            });
            res.json(kamera);
        });
    });
});


app.post('/equipment/ton', jsonParser, function (req, res){
      var newTon = req.body;

        client.incr('ton:ton', function(err, rep){
            newTon.ton = rep;
            client.set('ton:' + newTon.ton, JSON.stringify(newFotoCam), function(err, rep){
                res.json(newTon);
            });
        });
    });


app.put('/equipment/ton/:id', function TonInfoBearbeiten (req, res) {
  client.del('ton:'+req.params.ton/:id, function(err, rep){

        if (rep == 1) {TonInfoBearbeiten 
            var updatedTon = req.body;
            updatedCam.ton/:id = req.params.ton/:id;
            client.set('ton:'+req.params.ton/:id, JSON.stringify(updatedCam), function(err, rep) {
                res.json(updatedTon);
            });

        }
        else {
            res.status(404).type('text').send('Der Tonequipment wurde nicht gefunden');
        }
    });
});


app.get('/equipment/ton/:id', function kameraAusgeben(req, res){
     client.get('ton:' + req.params.ton/:id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Das Tonequipment mit der ID " + req.params.kameras/:id +  " ist nicht in der Datenbank");
        }
    });
});


app.delete('/equipment/ton/:id', function (req, res) {
client.del('ton:'+req.params.ton/:id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.ton/:id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Tonequipment mit der ID ' + req.params.ton/:id + ' wurde nicht gefunden');
        }
    });
});



// Ressource: Beleuchtung

app.get("/equipment/beleuchtung", function AlleLeuchtgeräteAusgeben(req, res){
    client.keys('beleuchtung:*', function(err, rep){
        var bel = [];

        if(rep.length == 0) {
            res.json(bel);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               beleuchtung.push(JSON.parse(val));
           });

            beleuchtung = beleuchtung.map(function(ton){
                return {beleuchtung/:id: beleuchtung.id, Name: beleuchtung.name, Merkmale: beleuchtung.infos};
            });
            res.json(beleuchtung);
        });
    });
});


app.post('/equipment/beleuchtung', jsonParser, function (req, res){
      var newBel = req.body;

        client.incr('beleuchtung:beleuchtung', function(err, rep){
            newBel.beleuchtung = rep;
            client.set('beleuchtung:' + newBel.beleuchtung, JSON.stringify(newFotoCam), function(err, rep){
                res.json(newBel);
            });
        });
    });


app.put('/equipment/beleuchtung/:id', function TonInfoBearbeiten (req, res) {
  client.del('beleuchtung:'+req.params.beleuchtung/:id, function(err, rep){

        if (rep == 1) {LeuchtInfoBearbeiten 
            var updatedBel = req.body;
            updatedCam.beleuchtung/:id = req.params.beleuchtung/:id;
            client.set('beleuchtung:'+req.params.beleuchtung/:id, JSON.stringify(updatedCam), function(err, rep) {
                res.json(updatedBel);
            });

        }
        else {
            res.status(404).type('text').send('Das Lichtequipment wurde nicht gefunden');
        }
    });
});


app.get('/equipment/beleuchtung/:id', function lichtgerätAusgeben(req, res){
     client.get('beleuchtung:' + req.params.beleuchtung/:id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Das Lichtquipment mit der ID " + req.params.beleuchtung/:id +  " ist nicht in der Datenbank");
        }
    });
});


app.delete('/equipment/beleuchtung/:id', function (req, res) {
client.del('beleuchtung:'+req.params.ton/:id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.beleuchtung/:id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Lichtquipment mit der ID ' + req.params.beleuchtung/:id + ' wurde nicht gefunden');
        }
    });
});



// Ressource: User

app.get("/users", function AlleUsersAusgeben(req, res){
    client.keys('users:*', function(err, rep){
        var user = [];

        if(rep.length == 0) {
            res.json(user);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               users.push(JSON.parse(val));
           });

            user = user.map(function(ton){
                return {users/:id: users.id, Name: users.name, Studiengang: users.studiengang, Semester: users.semester, Funktion: users.funktion};
            });
            res.json(users);
        });
    });
});


app.post('/users', jsonParser, function (req, res){
      var newUsr = req.body;

        client.incr('users:users', function(err, rep){
            newUsr.users = rep;
            client.set('users:' + newUsr.users, JSON.stringify(newUsr), function(err, rep){
                res.json(newUsr);
            });
        });
    });


app.put('/users/:id', function UserInfoBearbeiten (req, res) {
  client.del('users:'+req.params.users/:id, function(err, rep){

        if (rep == 1) {UserInfoBearbeiten 
            var updatedUsr = req.body;
            updatedUsr.users/:id = req.params.users/:id;
            client.set('users:'+req.params.users/:id, JSON.stringify(updatedUsr), function(err, rep) {
                res.json(updatedUsr);
            });

        }
        else {
            res.status(404).type('text').send('Der User wurde nicht gefunden');
        }
    });
});


app.delete('/users/:id', function (req, res) {
client.del('users:'+req.params.users/:id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.users/:id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Der User mit der ID ' + req.params.users/:id + ' wurde nicht gefunden');
        }
    });
});


app.get('/users/:id', function userAusgeben(req, res){
     client.get('users:' + req.params.users/:id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Der User mit der ID " + req.params.users/:id +  " ist nicht in der Datenbank");
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
                return {users/:id: users.id, Kommentar: users.kommentar};
            });
            res.json(users);
        });
    });
});


app.put('/users/:id/kommentare', function UserKommentarBearbeiten (req, res) {
  client.del('users:'+req.params.users/:id, function(err, rep){

        if (rep == 1) {UserKommentarBearbeiten 
            var updatedUsr = req.body;
            updatedUsr.users/:id/kommentare = req.params.users/:id/kommentare;
            client.set('users:'+req.params.users/:id/kommentare, JSON.stringify(updatedUsr), function(err, rep) {
                res.json(updatedUsr);
            });

        }
        else {
            res.status(404).type('text').send('Wurde nicht gefunden');
        }
    });
});


app.delete('/users/:id/kommentare', function (req, res) {
client.del('users:'+req.params./users/:id/kommentare, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.users/:id/kommentare + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Kommentar vom User mit der ID ' + req.params./users/:id/kommentare + ' wurde nicht gefunden');
        }
    });
});




// App läuft über Prot 3000
app.listen(3000);