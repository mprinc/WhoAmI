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

console.log("hello from 'forms'");

mongoose.connect('mongodb://localhost/SLaWS');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	console.log("openned - SLaWS");
	
	SLaWS.find(function(err, slaws_all) {
		console.log('all SLaWS:');
	  if (err) return console.error(err);
	  console.dir(slaws_all);
	});
	
	SLaWS.findOne({ form: 'руке' }, function(err, thor) {
		console.log('find specific:'); 
		  if (err) return console.error(err);
		  console.dir(thor);
		});
});
