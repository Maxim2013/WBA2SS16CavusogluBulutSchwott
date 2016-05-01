var fs = require('fs');
var chalk = require('chalk');

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) { 

if (err) throw err;

var obj = JSON.parse(data.toString());

obj.wolkenkratzer.sort(function(a, b){
return b.hoehe-a.hoehe});

fs.writeFile('wolkenkratzer_sortiert.json', JSON.stringify(obj),function(err){

if (err) throw err; 

obj.wolkenkratzer.forEach(function(wolkenkratzer) {

console.log(chalk.red('Name: '+wolkenkratzer.name));
console.log(chalk.green('Stadt: '+wolkenkratzer.stadt));
console.log(chalk.blue('Höhe: '+wolkenkratzer.hoehe));
console.log('------------------');

			});
});

});
