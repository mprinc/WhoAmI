'use strict';

// http://localhost:8080/aktivitiRecords/aktivitiRecords

var mockup = {fb: {authenticate: false}, db: {aktivitiRecord:false}};
var accessId = 0;
var LIMIT_NO = 25;

var Sequelize = require('sequelize');

function resSendJsonProtected(res, data){
	// http://tobyho.com/2011/01/28/checking-types-in-javascript/	
	if(data !== null && typeof data === 'object'){ // http://stackoverflow.com/questions/8511281/check-if-a-variable-is-an-object-in-javascript
		res.set('Content-Type', 'application/json');
		// JSON Vulnerability Protection
		// http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
		// https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
		res.send(")]}',\n" + JSON.stringify(data));
	}else if(typeof data === 'string'){ // http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
		res.send(data);
	}else{
		res.send(data);
	}
};

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

exports.index = function(req, res){
	if(isSetAny('mockup.db.user')){
		var users_json = [];
  		users_json.push({id: 1, entityPosX: 59.969408, entityPosY: 10.563519, partuser: "Тихо ноћи моје чедо спава (back-mockup)"});
  		users_json.push({id: 2, entityPosX: 59.959408, entityPosY: 10.763519, partuser: "а над главом од бисера грана (back-mockup)"});
  		users_json.push({id: 3, entityPosX: 59.979408, entityPosY: 10.963519, partuser: "А на грани к'о да нешто бруји (back-mockup)"});
  		users_json.push({id: 4, entityPosX: 59.999408, entityPosY: 10.663519, partuser: "то су мали, сићани славуји (back-mockup)"});
		resSendJsonProtected(res, {data: users_json, accessId : accessId});
		accessId ++;
		return;
	}

	var user = null;
	if(isSetAny('mockup.fb.authenticate')){
		req.user = {id: 2, displayName: 'mprinc', NsN: "Sasha Rudan", email: "mprinc@gmail.com"};
	}
	if(req.user == null){
		// res.redirect('/auth/facebook'); // redirection to login any access that is not authenticated

		// resSendJsonProtected(res, {data: [], accessId : accessId, message: "User is not logged in"});
		// return;
	}
	user = req.user;

	var type = req.params.type;
	var aktivitiRecordId = null;
	var version = null;
	var NsNLike = null;
	var tagName = null;
	console.log("type: %s", type);
	switch(type){
		case 'all':
			break;
		case 'many-NsN':
			NsNLike = req.params.searchParam;
			console.log("NsNLike: %s", NsNLike);
			break;
		case 'one':
			var searchParams = req.params.searchParam.split(":");
			aktivitiRecordId = searchParams[0];
			if(searchParams.length > 1){
				version = searchParams[1];
			}
			break;
	}
	// http://sequelizejs.com/documentation
	var findObj = {
		where: {},
		attributes: ['id', 'NsN', 'iAmId', 'previous', 'isPublic', 'createdAt', 'updatedAt'],
		// http://sequelizejs.com/docs/latest/models
		//limit: LIMIT_NO,
		order: [['iAmId', 'DESC'], ['createdAt', 'ASC'], ['NsN', 'DESC'], ['id', 'ASC']]
	};
	if(type == 'all'){
		// forbid listing other's poems except they are public
		// http://sequelizejs.com/docs/latest/models#block-30-line-3
		if(user){
			findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
		}else{
			findObj.where.isPublic = true;
		}
	}
	if(NsNLike){
		findObj['where']['NsN'] = {like: NsNLike+'%'};
		// forbid listing other's poems
		if(user){
			findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
		}else{
			findObj.where.isPublic = true;
		}
	}
	if(aktivitiRecordId){
		findObj['where']['id'] = aktivitiRecordId;
		if(user){
			findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
		}else{
			findObj.where.isPublic = true;
		}
	}

	if(aktivitiRecordId){
		console.log("aktivitiRecordId = %s", aktivitiRecordId);

	  	global.db.DataTalks.Aktiviti.AktivitiRecord.find(findObj)
		.success(function(aktivitiRecord) {
			if(aktivitiRecord){
				var aktivitiRecordOut = {id: aktivitiRecord.id, NsN: aktivitiRecord.NsN, iAmId: aktivitiRecord.iAmId, 
					previous: aktivitiRecord.previous, isPublic: aktivitiRecord.isPublic,
					createdAt: aktivitiRecord.createdAt, updatedAt: aktivitiRecord.updatedAt};
		    	console.log("[modules/aktivitiRecord.js:index] Loaded aktivitiRecord: %s", JSON.stringify(aktivitiRecord));

				resSendJsonProtected(res, {data: aktivitiRecordOut, accessId : accessId});
			}else{
		    	var msg = "No aktivitiRecord for specified id: " + aktivitiRecordId;
	    		resSendJsonProtected(res, {data: null, accessId : accessId, message: msg, success: false});				
			}
		}).error(function(err) {
	    	console.log(err);
	    	var msg = "error retrieving aktivitiRecords";
    		resSendJsonProtected(res, {data: null, accessId : accessId, message: msg, success: false});
		});
	}else if (type == 'all' || type == 'many-NsN'){
    	console.log("Searching for aktivitiRecords (type: %s) findObj: %s", type, JSON.stringify(findObj));
	  	global.db.DataTalks.Aktiviti.AktivitiRecord.findAll(findObj)
		.success(function(aktivitiRecords) {
			var aktivitiRecords_json = [];
	    	aktivitiRecords.forEach(function(aktivitiRecord) {
				var aktivitiRecordOut = {id: aktivitiRecord.id, NsN: aktivitiRecord.NsN, iAmId: aktivitiRecord.iAmId, previous: aktivitiRecord.previous,
					isPublic: aktivitiRecord.isPublic, createdAt: aktivitiRecord.createdAt, updatedAt: aktivitiRecord.updatedAt};
	      		aktivitiRecords_json.push(aktivitiRecordOut);
	    	});
	    	console.log("Loaded aktivitiRecords length: %d", aktivitiRecords_json.length);
			resSendJsonProtected(res, {data: aktivitiRecords_json, accessId : accessId});
		}).error(function(err) {
	    	console.log(err);
	    	var msg = "error retrieving aktivitiRecords";
    		resSendJsonProtected(res, {data: [], accessId : accessId, message: msg});
		});
	}
	accessId ++;
};


exports.create = function(req, res){
	console.log("[modules/aktiviti/aktivitiRecord.js:create] req.body: %s", JSON.stringify(req.body));
	
	var aktivitiRecord = req.body;
	var aktivitiRecordCreate = {};
	if(parseInt(aktivitiRecord.id) > 0){
		aktivitiRecordCreate.id =  parseInt(aktivitiRecord.id);
	}
	aktivitiRecordCreate.NsN = aktivitiRecord.NsN;
	aktivitiRecordCreate.iAmId = aktivitiRecord.iAmId;
	aktivitiRecordCreate.previous = aktivitiRecord.previous;
	aktivitiRecordCreate.isPublic = aktivitiRecord.isPublic;

	global.db.DataTalks.Aktiviti.AktivitiRecord.create(aktivitiRecordCreate)
	.success(function(aktivitiRecord){
		var aktivitiRecordCreated = {};
		aktivitiRecordCreated.id = aktivitiRecord.id;
		aktivitiRecordCreated.NsN = aktivitiRecord.NsN;
		aktivitiRecordCreated.iAmId = aktivitiRecord.iAmId;
		aktivitiRecordCreated.previous = aktivitiRecord.previous;
		aktivitiRecordCreated.isPublic = aktivitiRecord.isPublic;
		aktivitiRecordCreated.createdAt = aktivitiRecord.createdAt;
		aktivitiRecordCreated.updatedAt = aktivitiRecord.updatedAt;

		console.log("[modules/aktivitiRecord.js:create] aktivitiRecord (id:%d) created: %s",
			aktivitiRecordCreated.id, JSON.stringify(aktivitiRecordCreated));

		resSendJsonProtected(res, {success: true, data: aktivitiRecordCreated, accessId : accessId});

	}).error(function(error) {
		console.log("++++++++++");
		console.log(error);
		//done();
		var msg = "error creating aktivitiRecord";
		resSendJsonProtected(res, {success: false, data: null, accessId : accessId, message: msg});
	});
};