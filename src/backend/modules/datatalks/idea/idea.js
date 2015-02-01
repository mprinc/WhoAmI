'use strict';

// http://localhost:8080/ideas/ideas

var mockup = {fb: {authenticate: false}, db: {idea:false}};
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
		req.user = {id: 2, displayName: 'mprinc', name: "Sasha Rudan", email: "mprinc@gmail.com"};
	}
	if(req.user == null){
		// res.redirect('/auth/facebook'); // redirection to login any access that is not authenticated

		// resSendJsonProtected(res, {data: [], accessId : accessId, message: "User is not logged in"});
		// return;
	}
	user = req.user;

	var type = req.params.type;
	var ideaId = null;
	var version = null;
	var nameLike = null;
	var tagName = null;
	console.log("type: %s", type);
	switch(type){
		case 'all':
			break;
		case 'many-name':
			nameLike = req.params.searchParam;
			console.log("nameLike: %s", nameLike);
			break;
		case 'one':
			var searchParams = req.params.searchParam.split(":");
			ideaId = searchParams[0];
			if(searchParams.length > 1){
				version = searchParams[1];
			}
			break;
	}
	// http://sequelizejs.com/documentation
	var findObj = {
		where: {},
		attributes: ['id', 'name', 'title', 'iAmId', 'isPublic', 'createdAt', 'updatedAt'],
		// http://sequelizejs.com/docs/latest/models
		//limit: LIMIT_NO,
		order: [['name', 'DESC'], ['createdAt', 'DESC'], ['iAmId', 'DESC'], ['id', 'ASC']]
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
	if(nameLike){
		findObj['where']['name'] = {like: nameLike+'%'};
		// forbid listing other's poems
		if(user){
			findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
		}else{
			findObj.where.isPublic = true;
		}
	}
	if(ideaId){
		findObj['where']['id'] = ideaId;
		findObj.attributes.push('schemaSerialized', 'defaultDataContentSerialized', 'stateSchemaSerialized', 'defaultStateContentSerialized');
		if(user){
			findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
		}else{
			findObj.where.isPublic = true;
		}
	}

	if(ideaId){
		console.log("ideaId = %s", ideaId);

	  	global.db.Ideas.Idea.find(findObj)
		.success(function(idea) {
			if(idea){
				var ideaOut = {id: idea.id, name: idea.name, title: idea.title, iAmId: idea.iAmId, schemaSerialized: idea.schemaSerialized, defaultDataContentSerialized: idea.defaultDataContentSerialized,
					stateSchemaSerialized: idea.stateSchemaSerialized, defaultStateContentSerialized: idea.defaultStateContentSerialized, 
					isPublic: idea.isPublic, createdAt: idea.createdAt, updatedAt: idea.updatedAt};
		    	console.log("[modules/idea.js:index] Loaded idea: %s", JSON.stringify(idea));

				resSendJsonProtected(res, {data: ideaOut, accessId : accessId});
			}else{
		    	var msg = "No idea for specified id: " + ideaId;
	    		resSendJsonProtected(res, {data: null, accessId : accessId, message: msg, success: false});				
			}
		}).error(function(err) {
	    	console.log(err);
	    	var msg = "error retrieving ideas";
    		resSendJsonProtected(res, {data: null, accessId : accessId, message: msg, success: false});
		});
	}else if (type == 'all' || type == 'many-name'){
    	console.log("Searching for ideas (type: %s) findObj: %s", type, JSON.stringify(findObj));
	  	global.db.Ideas.Idea.findAll(findObj)
		.success(function(ideas) {
			var ideas_json = [];
	    	ideas.forEach(function(idea) {
				var ideaOut = {id: idea.id, name: idea.name, title: idea.title, iAmId: idea.iAmId, isPublic: idea.isPublic, createdAt: idea.createdAt, updatedAt: idea.updatedAt};
	      		ideas_json.push(ideaOut);
	    	});
	    	console.log("Loaded ideas length: %d", ideas_json.length);
			resSendJsonProtected(res, {data: ideas_json, accessId : accessId});
		}).error(function(err) {
	    	console.log(err);
	    	var msg = "error retrieving ideas";
    		resSendJsonProtected(res, {data: [], accessId : accessId, message: msg});
		});
	}
	accessId ++;
};


exports.create = function(req, res){
	console.log("[modules/iam/idea.js:create] req.body: %s", JSON.stringify(req.body));
	
	var idea = req.body;
	var ideaCreate = {};
	if(parseInt(idea.id) > 0){
		ideaCreate.id =  parseInt(idea.id);
	}
	ideaCreate.name = idea.name;
	ideaCreate.title = idea.title;
	ideaCreate.iAmId = idea.iAmId;
	ideaCreate.schemaSerialized = idea.schemaSerialized;
	ideaCreate.defaultDataContentSerialized = idea.defaultDataContentSerialized;
	ideaCreate.isPublic = idea.isPublic;

	global.db.Ideas.Idea.create(ideaCreate)
	.success(function(idea){
		var ideaCreated = {};
		ideaCreated.id = idea.id;
		ideaCreated.name = idea.name;
		ideaCreated.title = idea.title;
		ideaCreated.iAmId = idea.iAmId;
		ideaCreated.schemaSerialized = idea.schemaSerialized;
		ideaCreated.defaultDataContentSerialized = idea.defaultDataContentSerialized;
		ideaCreated.isPublic = idea.isPublic;

		console.log("[modules/idea.js:create] idea (id:%d) created: %s",
			ideaCreated.id, JSON.stringify(ideaCreated));

		resSendJsonProtected(res, {success: true, data: ideaCreated, accessId : accessId});

	}).error(function(error) {
		console.log("++++++++++");
		console.log(error);
		//done();
		var msg = "error creating idea";
		resSendJsonProtected(res, {success: false, data: [], accessId : accessId, message: msg});
	});
};

exports.update = function(req, res){
	console.log("[modules/iam/idea.js:update] req.body: %s", JSON.stringify(req.body));
	
	var idea = req.body;
	var ideaUpdate = {};
	ideaUpdate.name = idea.name;
	ideaUpdate.title = idea.title;
	ideaUpdate.schemaSerialized = idea.schemaSerialized;
	ideaUpdate.	defaultDataContentSerialized = idea.	defaultDataContentSerialized;
	ideaUpdate.isPublic = idea.isPublic;

	// https://github.com/sequelize/sequelize/wiki/API-Reference-Model#updateattrvaluehash-where-options----promise
	global.db.Ideas.Idea.update(ideaUpdate, { id: idea.id })
		.success(function(){
			console.log("idea updated. id = %d", idea.id);
			resSendJsonProtected(res, {success: true, data: [idea], accessId : accessId});
		}).error(function(error) {
			console.log("++++++++++");
			console.log(error);
			//done();
			var msg = "error saving idea";
			resSendJsonProtected(res, {success: false, data: [], accessId : accessId, message: msg});
		});
};