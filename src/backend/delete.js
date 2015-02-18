/**
 * New node file
 */
var mongoose = require('mongoose');

var SLaWSSchema = mongoose.Schema({
		form: String,
		lemma: String,
		ana: String,
		created:Boolean,
		modified: Boolean
	});
	
var SLaWS = mongoose.model('SLaWS', SLaWSSchema);

console.log("hello from 'delete'");

mongoose.connect('mongodb://localhost/SLaWS');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	console.log("openned - SLaWS");
	showDB('all SLaWS before:', deleteDB);
});

function deleteDB(callback){
	SLaWS.find(function(err, slaws_all) {
	  if (err) return console.error(err);
	  console.log('all SLaWS deleting:');
	  slaws_all.forEach( function (slaws_one) {
		  slaws_one.remove();
		  });
	  showDB('all SLaWS after:');
	});
}

function showDB(title, callback){
	SLaWS.find(function(err, slaws_all) {
	  if (err) return console.error(err);
	  console.log(title);
	  console.dir(slaws_all);
	  if(callback){callback();}
	});
}