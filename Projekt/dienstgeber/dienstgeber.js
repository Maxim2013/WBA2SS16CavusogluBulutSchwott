// Module werden eingebunden
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var http = require('http');

// Starten der Redis Datenbank
var db = redis.createClient();

// In App werden die Methoden von Express eingebunden
var app = express();

// App benutzt JSON-Parser
app.use(bodyParser.json());


//User Interaktion
app.post('/users', function userAnlegen(req, res){

        var newUser = req.body;

        db.incr('u_id:user', function(err, rep){
            newUser.u_id = rep;
            db.set('user:'+newUser.u_id, JSON.stringify(newUser), function(err, rep){
                res.status(200).json(newUser);
            });
        });
    });

app.get('/users/:u_id', function userAusgeben(req, res){
        db.get('user:'+req.params.u_id, function(err, rep){
           if(rep){
               res.type('json').send(rep);
           }
            else {
                res.status(404).type('text').send("Der User wurde nicht gefunden");
            }
        });
    });



app.get("/users", function alleUserausgeben(req, res){
    db.keys('user:*', function(err, rep){
        var users = [];

        if(rep.length == 0) {
            res.json(users);
            return;
        }

        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               users.push(JSON.parse(val));
           });
            res.json(users);
        });
    });
});


//Kamera Interaktion
app.post('/equipment/kameras', function kameraAnlegen(req, res){
        var newCam = req.body;

        db.incr('k_id:kameras', function(err, rep){
            newCam.k_id = rep;
            db.set('kameras:' + newCam.k_id, JSON.stringify(newCam), function(err, rep){
                res.json(newCam);
            });
        });
    });

app.put('/equipment/kameras/:k_id', function kameraInfoBearbeiten(req, res){
    db.exists('kameras:'+req.params.k_id, function(err, rep){
        if (rep == 1) {
            var updatedCam = req.body;
            updatedCam.k_id = req.params.k_id;
            db.set('kameras:'+req.params.k_id, JSON.stringify(updatedCam), function(err, rep) {
                res.json(updatedCam);
            });
        }
        else {
            res.status(404).type('text').send('Die Kamera wurde nicht gefunden');
        }
    });
});

app.get('/equipment/kameras/:k_id', function kameraAusgeben(req, res){
    db.get('kameras:' + req.params.k_id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Die Kamera mit der ID " + req.params.k_id +  " ist nicht in der Datenbank");
        }
    });
});

app.delete('/equipment/kameras/:k_id', function kameraLoeschen(req, res){
    db.del('kameras:'+req.params.k_id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK');
        }
        else{
            res.status(404).type('text').send('Die Kamera mit der ID ' + req.params.k_id + ' wurde nicht gefunden');
        }
    });
});

app.get("/equipment/kameras", function alleKamerasausgeben(req, res){
    db.keys('kameras:*', function(err, rep){
        var kameras = [];

        if(rep.length == 0) {
            res.json(kameras);
            return;
        }

        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               kameras.push(JSON.parse(val));
           });

            kameras = kameras.map(function(kameras){
                return {ID: kameras.k_id, Bezeichnung: kameras.bezeichnung, Sensor: kameras.sensor, Aufloesung: kameras.aufloesung};
            });
            res.json(kameras);
        });
    });
});


//Ausleihvorgang 
app.post('/equipment/ausleihen', function(req, res){
        var newAusleihe = req.body;
        
        db.incr('leih_id:ausleihe', function(err, rep){
                newAusleihe.leih_id = rep;
                db.set('ausleihe:' + newAusleihe.leih_id , JSON.stringify(newAusleihe), function(err,rep){
                    res.json(newAusleihe);
                });
        });
            
});

app.put('/equipment/ausleihen/:leih_id', function(req,res){
    db.exists('ausleihe:'+req.params.leih_id, function(err, rep){
        if(rep == 1){
            var updatedAusleihe = req.body;
            updatedAusleihe.leih_id = req.params.leih_id;
            db.set('ausleihe:' + req.params.leih_id, JSON.stringify(updatedAusleihe), function(err, rep){
                res.json(updatedAusleihe);
            });
        }
        else {
            res.status(404).type('text').send("Die Transaktion mit der ID " + req.pararms.leih_id + " wurde nicht gefunden");
        }
    });
});

app.get("/equipment/ausleihen/:leih_id", function(req, res){
    db.get('ausleihe:'+ req.params.leih_id, function(err, rep){

        if(rep.length == 0) {
            res.json(ausleihe);
            return;
        }

        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               ausleihe.push(JSON.parse(val));
           });
            res.json(ausleihe);
        });
    });
});

app.get("/equipment/ausleihen", function alleKamerasausgeben(req, res){
    db.keys('ausleihe:*', function(err, rep){
        var ausleihe = [];

        if(rep.length == 0) {
            res.json(ausleihe);
            return;
        }

        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               ausleihe.push(JSON.parse(val));
           });
            res.json(ausleihe);
        });
    });
});


//Beleuchtung Interaktion
app.post('/equipment/beleuchtung', function lightHinzufuegen(req, res){
        var newLi = req.body;

        db.incr('id:beleuchtung', function(err, rep){
            newLi.id = rep;
            db.set('beleuchtung:' + newLi.id, JSON.stringify(newLi), function(err, rep){
                res.json(newLi);
            });
        });
    });

app.get('/equipment/beleuchtung/:id', function lightAusgeben(req, res){
    db.get('beleuchtung:' + req.params.id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Die Kamera ist nicht in der Datenbank");
        }
    });
});

app.put('/equipment/beleuchtung:id', function lightInfoBearbeiten(req, res){
    db.exists('beleuchtung:'+req.params.id, function(err, rep){
        if (rep == 1){
            var updatedLi = req.body;
            updatedLi.id = req.params.id;
            db.set('beleuchtung:'+req.params.id, JSON.stringify(updatedLi), function(err, rep){
                res.json(updatedLi);
            });
        }
        else {
            res.status(404).type('text').send('Das Licht set mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});

app.delete('/equipment/beleuchtung:id', function lightLoeschen(req, res){
    db.del('beleuchtung:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK');
        }
        else{
            res.status(404).type('text').send('Das Licht Set mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});

app.get("/equipment/beleuchtung", function(req, res){
    db.keys('beleuchtung:*', function(err, rep){
        var light = [];

        if(rep.length == 0) {
            res.json(light);
            return;
        }

        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               light.push(JSON.parse(val));
           });

            res.json(light);
        });
    });
});


//Ton Interaktion
app.post('/equipment/ton', function TonHinzufuegen(req, res){
        var newTon = req.body;

        db.incr('id:ton', function(err, rep){
            newTon.id = rep;
            db.set('ton:' + newTon.id, JSON.stringify(newTon), function(err, rep){
                res.json(newTon);
            });
        });
    });

app.get('/equipment/ton/:id', function TonAusgeben(req, res){
    db.get('ton:' + req.params.id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Das Ton-Equipment ist nicht in der Datenbank");
        }
    });
});

app.put('/equipment/ton:id', function TonInfoBearbeiten(req, res){
    db.exists('ton:'+req.params.id, function(err, rep){
        if (rep == 1){
            var updatedTon = req.body;
            updatedTon.id = req.params.id;
            db.set('ton:'+req.params.id, JSON.stringify(updatedTon), function(err, rep){
                res.json(updatedTon);
            });
        }
        else {
            res.status(404).type('text').send('Das Ton-Equipment mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});

app.delete('/equipment/ton:id', function TonLoeschen(req, res){
    db.del('ton:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK');
        }
        else{
            res.status(404).type('text').send('Das Ton-Equipment mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});

app.get("/equipment/ton", function(req, res){
    db.keys('ton:*', function(err, rep){
        var ton = [];

        if(rep.length == 0) {
            res.json(ton);
            return;
        }

        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               ton.push(JSON.parse(val));
           });

            res.json(ton);
        });
    });
});


//Userkommentar Interaktion
app.put('/users/:id/kommentare',  function UserKommentarBearbeiten (req, res) {
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


// App läuft über Port 3000
app.listen(3000);
console.log('Listening on http://localhost:3000');
