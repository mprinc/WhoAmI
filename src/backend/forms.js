/**
 * New node file
 */

console.log("hello from 'forms'");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SLaWS');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	console.log("openned - SLaWS");
	var SLaWSSchema = mongoose.Schema({
		form: String,
		lemma: String,
		ana: String,
		created:Boolean,
		modified: Boolean
	});
	
	var SLaWS = mongoose.model('SLaWS', SLaWSSchema);
	
	SLaWS.find(function(err, slaws_all) {
	  if (err) return console.error(err);
	  console.log('all SLaWS:');
	  console.dir(slaws_all);
	});
});
