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

console.log("hello from 'init'");

mongoose.connect('mongodb://localhost/SLaWS');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	console.log("openned - SLaWS");
	
	showDB('all SLaWS before', inputDB);
	
	/*console.log(test);
	console.log(test2);*/
	
	//process.exit(code=0);
});


function showDB(title, callback){
	SLaWS.find(function(err, slaws_all) {
	  if (err) return console.error(err);
	  console.log(title);
	  console.dir(slaws_all);
	  if(callback){callback();}
	});
}

function inputDB(){
	console.log('inputing');
	var test = new SLaWS({form: 'руке', lemma: 'рука', ana: 'Nasjdjf'});
	var test2 = new SLaWS({form: 'руке', lemma: 'рука', ana: 'Nnpkdjf'});
	test.save();
	test2.save();
	showDB('all SLaWS after');
}