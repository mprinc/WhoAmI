// http://localhost:8080/datasets
var mockup = {fb: {authenticate: true}, db: {data:true}};
var accessId = 0;
var LIMIT_NO = 500;
var FOLDER_OUT = __dirname+"/../../../../experiments/"+"data/out";
//var FOLDER_OUT = __dirname+"/../../../../experiments/"+"data/out/uppsala";
var FOLDER_CACHE = __dirname+"/../../../../experiments/"+"cache";
//var FOLDER_OUT = __dirname+"/../../../../experiments/"+"cache/uppsala";
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
	var projectName = req.params.projectName;
	var datasetId = null;
	var nameLike = null;
	var file = null;

	console.log("type: %s", type);
	switch(type){
		case 'all':
			nameLike = req.params.searchParam;
			console.log("nameLike: %s", nameLike);
			break;
		case 'one':
		case 'one-outfile':
			datasetId = req.params.searchParam;
			file = FOLDER_OUT + '/' + projectName + '/' + datasetId + '.json';
			break;
		case 'one-dataset':
			datasetId = req.params.searchParam;
			file = FOLDER_CACHE + '/' + projectName + '/entry-' + datasetId + '.json';
			break;
	}

	var datasets_json = [];

	if(!projectName){
		projectName = 'zhenia-master';
	}

	if(datasetId){
		console.log("Providing dataset(type=%s): %s from the file: %s", type, datasetId, file);

		fs.readFile(file, 'utf8', function (err, data) {
			if(err) {
				console.log('Error: ' + err);
				res.send({error: err, dataset: datasets_json, accessId : accessId});
			}
			data = JSON.parse(data);
			datasets_json.push(data);
			res.send({dataset: datasets_json, accessId : accessId});
		});
	}
	if(type == 'all'){
		res.send({error: "Type='all' is currently not supported, but it might be supported in the future. Keep watching ;)", dataset: datasets_json, accessId : accessId});			
	}
	accessId ++;
};
