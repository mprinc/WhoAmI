// http://localhost:8080/datasets
var mockup = {fb: {authenticate: true}, db: {data:true}};
var accessId = 0;
var LIMIT_NO = 500;
// var DATASET_FOLDER = __dirname+"/../../../../experiments/"+"data/out/uppsala";
// var DATASET_FOLDER = "/var/www_support/bukvik/experiments/experiments-zns/"+"data";
var DATASET_FOLDER = __dirname+"/../../../../experiments/"+"data";
var fs = require('fs');

//globalConfig = require('hit');


function objectGetLast(objStr){
	var lastObj = null;
	var lastObjStr = "";
	var objStrs = objStr.split('.');
	for(var i=0; i<objStrs.length; i++){
		try{
			var obj = eval(lastObjStr ? lastObjStr+'.'+objStrs[i] : objStrs[i]);
			if(typeof obj === 'undefined') break;
			lastObjStr = lastObjStr ? lastObjStr+'.'+objStrs[i] : objStrs[i];
			lastObj = obj;
			console.log("objStr = %s, obj = %s", lastObjStr, JSON.stringify(obj));		
		}catch(err){
			console.log("Error = %s", err);
			break;
		}		
	}
	console.log("lastObjStr = %s, obj = %s", lastObjStr, JSON.stringify(lastObj));
	return [lastObjStr, lastObj];
}

function isSetAny(objStr){
	var objArr = objectGetLast(objStr),
		lastObjStr = objArr[0], 
		lastObj = objArr[1];
	if(lastObj == true){
		console.log("lastObjStr (%s) is true (%s)", lastObjStr, lastObj);
		return true;
	}else{
		console.log("lastObjStr (%s) is not true (%s)", lastObjStr, lastObj);
		return false;
	}
}

exports.index = function(req, res, globalConfig){
	console.log("[modules/iam/dataset.js:index] user: %s", JSON.stringify(req.user));
	console.log("[modules/iam/dataset.js:index] globalConfig: %s", JSON.stringify(globalConfig));

	if(isSetAny('mockup.fb.authenticate')){
		req.user = {name: "Sasha Rudan", email: "mprinc@gmail.com"};
	}
	if(req.user == null) res.redirect('/auth/facebook'); // redirection to login any access that is not authenticated

	var type = req.params.type;
	var experimentId = null;
	var nameLike = null;
	console.log("type: %s", type);
	switch(type){
		case 'all':
		case 'all-exp':
		case 'all-env':
			nameLike = req.params.searchParam;
			console.log("nameLike: %s", nameLike);
			break;
		case 'one':
			experimentId = req.params.searchParam;
			break;
	}

	var datasets_json = [];

	
	if(experimentId){
		var file = DATASET_FOLDER + '/' + experimentId + '.json';
		console.log("Providing data: %s from the file: %s", experimentId, file);

		fs.readFile(file, 'utf8', function (err, data) {
			if(err) {
				console.log('Error: ' + err);
				res.send({error: err, data: datasets_json, accessId : accessId});
			}
			var data = JSON.parse(data);
			datasets_json.push(data);
			res.send({data: datasets_json, accessId : accessId});
		});
	}
	if(type == 'all' || type == 'all-exp' || type == 'all-env'){
		var path = require("path");
		var datasets_json = [];
		
		// http://nodejs.org/api/path.html
		// http://nodeexamples.com/2012/09/28/getting-a-directory-listing-using-the-fs-module-in-node-js/
		fs.readdir(DATASET_FOLDER, function (err, files) {
			if (err) {
				res.send({data: [], accessId : accessId, message: err});
			}
			files.map(function (file) {
				return file; // nothing at this moment here :)
			}).filter(function (file) {
				if(!fs.statSync(DATASET_FOLDER + path.sep + file).isFile()) return false;
				if(path.extname(file) !== ".json") return false;					

				if(type == 'all-exp'){ // only experiment files
					if(file.indexOf(".env.") >= 0) return false;
				}
				if(type == 'all-env'){ // only environemnt files
					if(file.indexOf(".env.") < 0) return false;					
				}
				return true;
			}).forEach(function (file) {
				var data = {
					'name-id': path.basename(file, path.extname(file)),
					name: path.basename(file, path.extname(file)),
					type: "experiment"
				};
				datasets_json.push(data);
			});
			res.send({data: datasets_json, accessId : accessId});
		});
		
		// res.send({error: "Type='all' is currently not supported, but it might be supported in the future. Keep watching ;)", data: datasets_json, accessId : accessId});
					
	}

	accessId ++;
};
