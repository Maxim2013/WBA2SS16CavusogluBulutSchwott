// Module werden eingebunden
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var http = require('http');
var client = redis.createClient();

// Starten der Redis Datenbank
var db = redis.createClient();

//jsonParser anlegen (ist ein Teil der bodyParser und deswegen nicht mit require) und gibt einen Parser zurück, der mit Json-Daten arbeitet
var jsonParser = bodyParser.json();

// In App werden die Methoden von Express eingebunden
var app = express();

// App benutzt JSON-Parser
app.use(bodyParser.json());


// Ressource: Ausleih 

app.get("/equipment/kamera/ausleih", function AusleihInfoKamera (req, res){
    client.keys('ausleihe:*', function(err, rep){
        var ausleihe = [];

        if(rep.length == 0) {
            res.json(ausleihe);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               ausleihe.push(JSON.parse(val));
           });
            res.json(ausleihe);
        });
    });
});

app.put('/equipment/ausleihen/ausleih_id', function(req,res){
    client.exists('ausleihe:'+req.params.ausleih_id, function(err, rep){
        if(rep == 1){
            var updatedAusleihe = req.body;
            updatedAusleihe.ausleih_id = req.params.ausleih_id;
            client.set('ausleihe:' + req.params.ausleih_id, JSON.stringify(updatedAusleihe), function(err, rep){
                res.json(updatedAusleihe);
              });
          }
        else {
            res.status(404).type('text').send("Die Transaktion mit der ID " + req.pararms.ausleih_id + " wurde nicht gefunden");
        }
    });
});

app.post('/equipment/ausleihen', function(req, res){
        var newAusleihe = req.body;
        
        client.incr('ausleih_id:ausleihe', function(err, rep){
                newAusleihe.ausleih_id = rep;
                client.set('ausleihe:' + newAusleihe.ausleih_id , JSON.stringify(newAusleihe), function(err,rep){
                    res.json(newAusleihe);
                  });
              });
      });

app.get("/equipment/kamera", function AlleKamerasAusgeben(req, res){
    client.keys('kameras:*', function(err, rep){
        var kamera = [];

        if(rep.length == 0) {
            res.json(kamera);
            return;
        }

        client.mget(rep, function(err, rep){
           rep.forEach(function(val){
               kamera.push(JSON.parse(val));
           });

            kamera = kamera.map(function(kamera){
                return {kamera_id: kamera.kamera_id, hersteller: kamera.hersteller, modell: kamera.modell};
            });
            res.json(kamera);
        });
    });
});


// Ressource: Fotokamera

app.get('/equipment/kamera/fotokamera/_fotokamera_id/', function kameraAusgeben(req, res){
     client.get('kameras:' + req.params.fotokamera_id, function(err, rep){
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Die Kamera mit der ID " + req.params.fotokamera_id +  " ist nicht in der Datenbank");
        }
    });
});
   

app.post('/equipment/kamera/fotokamera/fotokamera_id/', jsonParser, function (req, res){
      var newFotoCam = req.body;

        client.incr('fotokamera_id:kameras', function(err, rep){
            newFotoCam.fotokamera_id = rep;
            client.set('kameras:' + newFotoCam.fotokamera_id, JSON.stringify(newFotoCam), function(err, rep){
                res.json(newfotoCam);
            });
        });
    });


app.put('/equipment/kamera/fotokamera/fotokamera_id/', function kameraInfoBearbeiten (req, res) {
  client.del('kameras:'+req.params.fotokamera_id, function(err, rep){
        if (rep == 1) {kameraInfoBearbeiten 
            var updatedCam = req.body;
            updatedCam.fotokamera_id = req.params.fotokamera_id;
            client.set('kameras:'+req.params.fotokamera_id, JSON.stringify(updatedCam), function(err, rep) {
                res.json(updatedCam);
            });
        }
        else {
            res.status(404).type('text').send('Die Kamera wurde nicht gefunden');
        }
    });
});

app.delete('/equipment/kamera/fotokamera/fotokamera_id/', function (req, res) {
 client.del('kameras:'+req.params.fotokamera_id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK');
        }
        else{
            res.status(404).type('text').send('Die Kamera mit der ID ' + req.params.fotokamera_id + ' wurde nicht gefunden');
        }
    });
});

// Ressource: Beleuchtung-LED

app.get('/equipment/beleuchtung/led_beleuchtung/led_bel_id/', function (req, res){
       client.get('beleuchtung:' + req.params.led_bel_id, function(err, rep){
        
        if(rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send("Die Kamera ist nicht in der Datenbank+req.params.id+existiert nicht");
        }
    });
});

app.post('/equipment/beleuchtung/led_beleuchtung/led_bel_id/', function (req, res){
 
        var newLi = req.body;

        client.incr('id:beleuchtung', function(err, rep){
            newBel.led_bel_id = rep;
            client.set('beleuchtung:' + newBel.led_bel_id, JSON.stringify(newBel), function(err, rep){
                res.json(newBel);
            });
        });
    });     

app.put('/equipment/beleuchtung/led_beleuchtung/led_bel_id/', function (req, res) {
  
            var updatedBel = req.body;
            updatedBel.led_bel_id = req.params.led_bel_id;
            client.set('beleuchtung:'+req.params.led_bel_id, JSON.stringify(updatedBel), function(err, rep){
                res.json(updatedBel);

            res.status(404).type('text').send('Das Licht set mit der ID ' + req.params.led_bel_id + ' wurde nicht gefunden');
        });
});


app.delete('/equipment/beleuchtung/led_beleuchtung/led_bel_id/', function (req, res) {
client.del('beleuchtung:'+req.params.led_bel_id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK'+ req.params.id + 'gelöscht');
        }
        else{
            res.status(404).type('text').send('Das Licht Set mit der ID ' + req.params.led_bel_id + ' wurde nicht gefunden');
        }
    });
});
  

// Ressource: User

app.get('/user', function AlleUserAusgeben (req, res){
   client.get('user:*'+req.params.id, function(err, rep){
        var user = [];

        if(rep.length == 0) {
            res.json(user);
            return;
        }
        else{

        res.status(404).type('text').send('Der User mit der ID '+req.params.id+' existiert nicht');    
           }
        

           });
           
        });




app.post('/user/user_id/', function userAnlegen(req, res){
      var newUser = req.body;

        db.incr('user_id:user', function(err, rep){
            newUser.user_id = rep;
            db.set('user:'+newUser.user_id, JSON.stringify(newUser), function(err, rep){
                res.status(200).json(newUser);
            });
        });
    });


app.put('/user/user_id/', function userInfoBearbeiten (req, res) {
        if (rep == 1){
            var updatedUser = req.body;
            updatedUser.user_id = req.params.user_id;
            client.set('user:'+req.params.user_id, JSON.stringify(updatedUser), function(err, rep){
                res.json(updatedUser);
            });
        }
        else {
            res.status(404).type('text').send('Der User mit der ID ' + req.params.user_id + ' wurde nicht gefunden');
        }
    });
});


app.delete('/user/user_id/', function userLoeschen (req, res) {
 
        if(rep == 1){
            res.status(200).type('text').send('OK');
        }
        else{
            res.status(404).type('text').send('Der User mit der ID ' + req.params.user_id + ' wurde nicht gefunden');
        }

        });
});

// App läuft über Prot 3000
app.listen(3000);
