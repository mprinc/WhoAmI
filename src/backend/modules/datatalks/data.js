'use strict';

// http://localhost:8080/datas
var mockup = {fb: {authenticate: false}, db: {data:false}};
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
	//console.log("[modules/data.js:index] user: %s", JSON.stringify(req.user));
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
	
	// work with session
	// req.session.userCountId++;

	if(isSetAny('mockup.db.data')){
		var datas_json = [];
  		datas_json.push({id: 1, entityPosX: 59.969408, entityPosY: 10.563519, partdata: "Тихо ноћи моје чедо спава (back-mockup)"});
  		datas_json.push({id: 2, entityPosX: 59.959408, entityPosY: 10.763519, partdata: "а над главом од бисера грана (back-mockup)"});
  		datas_json.push({id: 3, entityPosX: 59.979408, entityPosY: 10.963519, partdata: "А на грани к'о да нешто бруји (back-mockup)"});
  		datas_json.push({id: 4, entityPosX: 59.999408, entityPosY: 10.663519, partdata: "то су мали, сићани славуји (back-mockup)"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}else{
		var ideaId = req.params.ideaId;
		var type = req.params.type;
		var searchParam = req.params.searchParam;
		var dataId = null;
		var version = null;
		var nameLike = null;
		var tagName = null;
		var decoratedDataId = null;

		console.log("ideaId: %s, type: %s, searchParam: %s", ideaId, type, searchParam);
		switch(type){
			case 'all':
				break;
			case 'by-decorated':
				decoratedDataId = parseInt(req.params.searchParam);
				console.log("decoratedDataId: %d", decoratedDataId);
				break;
			case 'many-name':
				nameLike = req.params.searchParam;
				console.log("nameLike: %s", nameLike);
				break;
			case 'tag-name':
				tagName = req.params.searchParam;
				console.log("tagName: %s", tagName);
				break;
			case 'one':
				if(!req.params.searchParam){
					var msg = "data id (searchParam) is missing";
			    	resSendJsonProtected(res, {data: null, message: msg, success: false});			  			
					return;
				}
				var searchParams = req.params.searchParam.split(":");
				dataId = searchParams[0];
				if(searchParams.length > 1){
					version = searchParams[1];
				}
				break;
		}
		// http://sequelizejs.com/documentation
		var findObj = {
			// where: ['ideaId = ? and version = activeVersion', 1], // {ideaId: '1'}, /* id: '80', */
			where: {},
			attributes: ['id', 'name', 'iAmId', 'version', 'ideaId', 'createdAt', 'isPublic', 'decoratedDataId'],
			// http://sequelizejs.com/docs/latest/models
			//limit: LIMIT_NO,
			order: [['createdAt', 'DESC'], ['iAmId', 'DESC'], ['id', 'ASC']]
		};
		if(ideaId != 'all'){
			findObj.where.ideaId = ideaId;
		}

		if(type == 'all'){
			// forbid listing other's poems except they are public
			// http://sequelizejs.com/docs/latest/models#block-30-line-3
			if(user){
				findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
			}else{
				findObj.where.isPublic = true;
			}
		}
		if(decoratedDataId){
			findObj['where']['decoratedDataId'] = decoratedDataId;
			findObj.attributes.push('dataContentSerialized');
			// forbid listing other's poems
			if(user){
				findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
			}else{
				findObj.where.isPublic = true;
			}			
		}
		if(nameLike){
			findObj['where']['name'] = {like: '%'+nameLike+'%'};
			// forbid listing other's poems
			if(user){
				findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
			}else{
				findObj.where.isPublic = true;
			}
		}
		if(dataId){
			findObj['where']['id'] = dataId;
			findObj.attributes.push('dataContentSerialized');

			if(version){
				findObj['where']['version'] = version;
			}
			if(user){
				findObj.where = Sequelize.and(findObj.where, Sequelize.or({iAmId: user.id}, {isPublic: true}));			
			}else{
				findObj.where.isPublic = true;
			}
		}
		if(!findObj['where']['version']){
			findObj['where'] = Sequelize.and(findObj['where'], 'version = activeVersion');
		}

		if(tagName){
			// this is possible to write
			// global.db.TagRelation.getDataIdsConnectedToTagName(tagName).then(function(datasId){
				// return global.db.Data.getDatasById(datasId);
			// })
			// but this is shortened version
			global.db.TagRelation.getDataIdsConnectedToTagName(tagName).then(global.db.Data.getDatasById).then(function(datas){
				if(datas){
					var datas_json = [];
			    	datas.forEach(function(data) {
			      		datas_json.push({id: data.id, sourceid: data.sourceid, name: data.name, iAmId: data.iAmId, version: data.version,
			      			ideaId: data.ideaId, dataContentSerialized: data.dataContentSerialized, isPublic :data.isPublic, decoratedDataId: data.decoratedDataId});
			    	});
				    //console.log("Loaded datas: %s", JSON.stringify(datas_json));
					resSendJsonProtected(res, {data: datas_json, accessId : accessId});						
				}else{
			    	console.log(err);
			    	var msg = "error retrieving datas";
			    	resSendJsonProtected(res, {data: [], accessId : accessId, message: msg});
				}				
			}).catch(function(err){
				console.log("[modules/data.js:index] err (getDatasById): %s", err);
			});
		}

		if(dataId){
			console.log("dataId = %s", dataId);

		  	global.db.Data.find(findObj)
			.success(function(data) {
				if(data){
					var datas_json = [];
					var dataOut = {id: data.id, sourceid: data.sourceid, name: data.name, iAmId: data.iAmId, version: data.version, ideaId: data.ideaId, 
						dataContentSerialized: data.dataContentSerialized, isPublic: data.isPublic, decoratedDataId: data.decoratedDataId};
			    	console.log("[modules/data.js:index] Loaded data: %s", JSON.stringify(data));
			    	
			    	if(data.ideaId != 1){
			    		dataOut.dataContentSerialized = data.dataContentSerialized;
						resSendJsonProtected(res, {data: dataOut, accessId : accessId});
			    	}else{
						var findObj = {
							where: {dataId: dataId, version: data.version, componentIndex: 3},
							attributes: ['content'],
							// http://sequelizejs.com/docs/latest/models
							limit: 1
						};
					  	global.db.ComponentTextLong.findAll(findObj).success(function(componentTextLongs) {
					  		if(componentTextLongs.length < 1){
					  			var msg = "error retrieving componentTextLong (no componentTextLong for where: "+findObj['where']+")";
						    	console.log(msg);
						    	resSendJsonProtected(res, {data: null, message: msg, success: false});			  			
					  		}
					  		var componentTextLong = componentTextLongs[0];
					  		dataOut.content = componentTextLong.content;
	
	
					    	// Sequelize doesn't support composite key :(
							var findObj = {
								where: {dataId: dataId, version: data.version, componentIndex: 4},
								attributes: ['content'],
								// http://sequelizejs.com/docs/latest/models
								limit: 1
							};
						  	global.db.ComponentTextMedium.findAll(findObj).success(function(versionsDesc) {
						  		if(versionsDesc.length < 1){
						  			var msg = "error retrieving componentTextLong (no componentTextLong for where: "+findObj['where']+")";
							    	console.log(msg);
							    	if(false){
								    	resSendJsonProtected(res, {data: null, message: msg, success: false});			  			
							    		return;
							    	}
						  		}else{
							  		var versionDesc = versionsDesc[0];
							  		dataOut.versionDesc = versionDesc.content;					  			
						  		}
								resSendJsonProtected(res, {data: dataOut, accessId : accessId, success: true});
						  	}).error(function(err) {
					    		console.log(err);
					    		var msg = "error retrieving componentTextLong";
						    	resSendJsonProtected(res, {data: null, message: msg, success: false});			  			

							});
					  	}).error(function(err) {
				    		console.log(err);
					    		var msg = "error retrieving componentTextLong";
						    	resSendJsonProtected(res, {data: null, message: msg, success: false});			  			
						});			    		
			    	}
				}else{
					var msg = "error retrieving data (no data for dataId: "+dataId+")";
		    		console.log(msg);
		    		resSendJsonProtected(res, {data: null, accessId : accessId, message: msg});
				}
			}).error(function(err) {
		    	console.log(err);
		    	var msg = "error retrieving datas";
	    		resSendJsonProtected(res, {data: [], accessId : accessId, message: msg});

			});
		}else if (type == 'all' || type == 'many-name' || type == 'by-decorated'){
	    	console.log("Searching for datas (type: %s) findObj: %s", type, JSON.stringify(findObj));
		  	global.db.Data.findAll(findObj)
			.success(function(datas) {
				var datas_json = [];
		    	datas.forEach(function(data) {
				    	console.log("(type: %s) data.dataContentSerialized: %s, data.['dataContentSerialized']: %s, data: %s",
				    	type, data.dataContentSerialized, JSON.stringify(data['dataContentSerialized']), JSON.stringify(data));
		    		var dataObj = {id: data.id, name: data.name, iAmId: data.iAmId, version: data.version, ideaId: data.ideaId, isPublic: data.isPublic, 
		    			decoratedDataId: data.decoratedDataId, createdAt: data.createdAt, updatedAt: data.updatedAt};
		    		if(type == 'by-decorated'){
				    	console.log("Searching for datas (type: %s) data.dataContentSerialized: %s", type, data.dataContentSerialized);
		    			dataObj.dataContentSerialized = data.dataContentSerialized;
		    		}
		      		datas_json.push(dataObj);
		    	});
		    	console.log("Loaded datas length: %d", datas_json.length);
			    //console.log("Loaded datas: %s", JSON.stringify(datas_json));
		    	// Uses views/datas.ejs
		    	//res.render("datas", {datas: datas_json});
				resSendJsonProtected(res, {data: datas_json, accessId : accessId});
			}).error(function(err) {
		    	console.log(err);
		    	var msg = "error retrieving datas";
	    		resSendJsonProtected(res, {data: [], accessId : accessId, message: msg});
			});
		}
	}
	accessId ++;
};

exports.create = function(req, res){
	console.log("[modules/data.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	var dataCreate = {};
	if(parseInt(data.id) > 0){
		dataCreate.id =  parseInt(data.id);
	}
	dataCreate.name = data.name;
	dataCreate.iAmId = data.iAmId;
	dataCreate.ideaId = data.ideaId;
	dataCreate.version = data.version;
	dataCreate.dataContentSerialized = data.dataContentSerialized;
	dataCreate.isPublic = data.isPublic;
	dataCreate.decoratedDataId = data.decoratedDataId;
	dataCreate.activeVersion = data.version;
	dataCreate.versionDesc = data.versionDesc;


	var dataUpdate = {};
	dataUpdate['activeVersion'] = data.version;
	global.db.Data.update(dataUpdate, { id: data.id })
	.success(function(){
		console.log("data activeVersion (%d) updated.", data.version);

		console.log("[modules/data.js:create] dataCreate: %s", JSON.stringify(dataCreate));

		global.db.Data.create(dataCreate)
		.success(function(dataCreatedC){
			var dataCreated = {};
			dataCreated.id = dataCreatedC.id;
			dataCreated.name = dataCreatedC.name;
			dataCreated.iAmId = dataCreatedC.iAmId;
			dataCreated.ideaId = dataCreatedC.ideaId;
			dataCreated.version = dataCreatedC.version;
			dataCreated.dataContentSerialized = dataCreatedC.dataContentSerialized;
			dataCreated.isPublic = data.isPublic;
			dataCreated.decoratedDataId = data.decoratedDataId;
			dataCreated.activeVersion = dataCreatedC.activeVersion;
	
			console.log("[modules/data.js:create] data (id:%d) created: %s",
				dataCreated.id, JSON.stringify(dataCreated));
			//done();
	
			if(dataCreate.ideaId != 1){
				resSendJsonProtected(res, {success: true, data: dataCreated, accessId : accessId});				
			}else{
				var textCreate = {};
				textCreate.dataId = dataCreatedC.id;
				textCreate.version = data.version;
				textCreate.componentIndex = 3;
				textCreate.content = data.content;

				global.db.ComponentTextLong.create(textCreate)
				.success(function(textCreated){
					console.log("text created: %s", JSON.stringify(textCreated));
		
					dataCreated.content = textCreated.content;
		
					//done();
		
					var versionDescCreate = {};
					versionDescCreate.dataId = dataCreatedC.id;
					versionDescCreate.version = data.version;
					versionDescCreate.componentIndex = 4;
					versionDescCreate.content = data.versionDesc;
			
					global.db.ComponentTextMedium.create(versionDescCreate)
					.success(function(versionDescCreated){
						dataCreated.versionDesc = versionDescCreated.content;
			
						console.log("versionDesc created: %s", JSON.stringify(versionDescCreated));
						//done();
						resSendJsonProtected(res, {success: true, data: dataCreated, accessId : accessId});
					}).error(function(error) {
						console.log("++++++++++");
						console.log(error);
						//done();
						resSendJsonProtected(res, "error creating versionDesc");
					});
		
				}).error(function(error) {
					console.log("++++++++++");
					console.log(error);
					//done();
					resSendJsonProtected(res, "error creating content");
				});				
			}
		}).error(function(error) {
			console.log("++++++++++");
			console.log(error);
			//done();
			resSendJsonProtected(res, "error creating idea");
		});

	}).error(function(error) {
		console.log("++++++++++");
		console.log(error);
		//done();
		resSendJsonProtected(res, "error updating data activeVersion");
	});
};

exports.update = function(req, res){
	console.log("[modules/data.js:update] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	var dataUpdate = {};
	dataUpdate.name = data.name;
	//dataUpdate.dataContentSerialized = data.dataContentSerialized;
	dataUpdate.isPublic = data.isPublic;
	dataUpdate.dataContentSerialized = data.dataContentSerialized;
	dataUpdate.dataUpdatedataContent = null;
	delete dataUpdate.dataUpdatedataContent;

	// https://github.com/sequelize/sequelize/wiki/API-Reference-Model#updateattrvaluehash-where-options----promise
	global.db.Data.update(dataUpdate, { id: data.id, version: data.version })
	.success(function(){
		console.log("data updated. id = %d", data.id);
		//done();
		var updateText={};
		if(data.ideaId != 1){
			resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		}else{
			updateText['content']= data['content'];
			global.db.ComponentTextLong.update(updateText, { dataId: data.id, version: data.version, componentIndex: 3 })
			.success(function(){
				console.log("text updated: dataId: %d", data.id);
				//done();

				var updateVersionDesc={};
				updateVersionDesc['content']= data['versionDesc'];

				var versionDescCreate = {};
				versionDescCreate.dataId = data.id;
				versionDescCreate.version = data.version;
				versionDescCreate.componentIndex = 4;
				versionDescCreate.content = data.versionDesc;

				// http://sequelizejs.com/docs/latest/models#block-26-line-1
				global.db.ComponentTextMedium.findOrCreate({dataId: data.id, version: data.version, componentIndex: 4}, versionDescCreate)
				.success(function(versionDescCreated, created){
					console.log(" versionDesc (id = %d) %s", versionDescCreate.dataId, created ? "created" : "found");
					if(created){
						resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
					}else{
						global.db.ComponentTextMedium.update(updateVersionDesc, { dataId: data.id, version: data.version, componentIndex: 4 })
						.success(function(){
							console.log("versionDesc updated: dataId: %d", data.id);
							//done();
							resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
						}).error(function(error) {
							console.log("++++++++++");
							console.log(error);
							//done();
							resSendJsonProtected(res, "error saving data");
						});							
					}

				}).error(function(error) {
					console.log("++++++++++");
					console.log(error);
					//done();
					resSendJsonProtected(res, "error finding/creating tag");
				});

			}).error(function(error) {
				console.log("++++++++++");
				console.log(error);
				//done();
				resSendJsonProtected(res, "error saving data");
			});
		}
	}).error(function(error) {
		console.log("++++++++++");
		console.log(error);
		//done();
		resSendJsonProtected(res, "error saving data");
	});
};

exports.destroy = function(req, res){
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/data.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));
	global.db.Data.destroy({ id: dataId })
		.success(function(){
			console.log("[modules/data.js:destroy] data (%d) deleted", dataId);
			//done();
			var data = {id:dataId};
			resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		}).error(function(error) {
			console.log("++++++++++");
			console.log("[modules/tagRelation:destroy] error: %ss", error);
			//done();
			var msg = "Error deleting data: " + error;
			resSendJsonProtected(res, {data: data, accessId : accessId, message: msg, success: false});
			resSendJsonProtected(res, "");
		});
};