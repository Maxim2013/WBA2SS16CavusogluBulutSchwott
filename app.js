var fs = require('fs');


fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) { 

if (err) throw err;

var obj = JSON.parse(data.toString());


obj.wolkenkratzer.forEach(function(wolkenkratzer) {

console.log('Name: '+wolkenkratzer.name);
console.log('Stadt: '+wolkenkratzer.stadt);
console.log('Höhe: '+wolkenkratzer.hoehe);
console.log('------------------');

			});

});


