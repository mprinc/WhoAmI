// http://localhost:8080/datas
var mockup = {fb: {authenticate: true}, db: {data:true}};
var accessId = 0;
var LIMIT_NO = 500;

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
	//console.log("[modules/experiment.js:index] req: %s", req);
	//console.log("[modules/experiment.js:index] res: %s", JSON.stringify(res));
	console.log("[modules/experiment.js:index] user: %s", JSON.stringify(req.user));
	console.log("[modules/experiment.js:index] globalConfig: %s", JSON.stringify(globalConfig));

	if(isSetAny('mockup.fb.authenticate')){
		req.user = {name: "Sasha Rudan", email: "mprinc@gmail.com"};
	}
	if(req.user == null) res.redirect('/auth/facebook'); // redirection to login any access that is not authenticated

	var type = req.params.type;
	var dataId = null;
	var nameLike = null;
	console.log("type: %s", type);
	switch(type){
		case 'all':
			nameLike = req.params.searchParam;
			console.log("nameLike: %s", nameLike);
			break;
		case 'one':
			dataId = req.params.searchParam;
			break;
	}

	if(isSetAny('mockup.db.data')){
		var datas_json = [];
  		if(type == 'all' || dataId == 'nabokov-in-english') datas_json.push({id: 1, name: "nabokov-in-english", iAmId: 2, version: 1, ideaId: 1,
  			"content": {
  				"desc": "Experimenting proving proactive social-influence is breaking hub",
  				"parameters": [
	  				{
	  					"id": 1,
	  					"name-id": "nodes-no",
	  					"type": "range",
	  					"name": "Nodes Number",
	  					"min": 5,
	  					"max": 100,
	  					"step": 1,
	  					"value": 10
	  				},
	  				{
	  					"id": 2,
	  					"name-id": "hubs-no",
	  					"type": "range",
	  					"name": "Hubs Number",
	  					"min": 1,
	  					"max": 10,
	  					"step": 1,
	  					"value": 3
	  				},
	  				{
	  					"id": 3,
	  					"name-id": "influence-range",
	  					"type": "range",
	  					"name": "Percentage of Influence",
	  					"min": 0,
	  					"max": 100,
	  					"step": 0.5,
	  					"value": 10
	  				},
	  				{
	  					"id": 4,
	  					"name-id": "should-influence",
	  					"type": "checkbox",
	  					"name": "Should influence",
	  					"value": true
	  				},
	  				{
	  					"id": 5,
	  					"name-id": "steps-no",
	  					"type": "int",
	  					"name": "Iteration Steps Number",
	  					"value": 5
	  				}
  				],
  				"dataviews": [
  					{
  						"id": 0,
  						"name-id": "gary-in-english.distribution",
  						"name": "gary-in-english.distribution",
  						"type": "distribution.diagram",
  						"datasetId": "english-comparative-datasets - pos-distributions-unigrams"
  					},
  					// {
  						// "id": 1,
  						// "name-id": "gary-in-english.comparative",
  						// "name": "gary-in-english.comparative",
  						// "type": "distribution.diagram",
  						// "datasetId": "gary-in-english - pos-distributions-unigrams"
  					// }
  					// ,
  					// {
  						// "id": 0,
  						// "name-id": "nabokov-into-english.distribution",
  						// "name": "nabokov-into-english.distribution",
  						// "type": "distribution.diagram",
  						// "datasetId": "nabokov-into-english - pos-distributions-unigrams"
  					// },
  					// {
  						// "id": 1,
  						// "name-id": "nabokov-into-english.comparative",
  						// "name": "nabokov-into-english.comparative",
  						// "type": "distribution.diagram",
  						// "datasetId": "nabokov-into-english - pos-distributions-unigrams"
  					// }
  				]
  			}
  		});
  		else if(type == 'all' || dataId == 'gary-in-english') datas_json.push({id: 2, name: "gary-in-english", iAmId: 2, version: 1, ideaId: 1, content: " Hurra from Rotating"});
  		else if(type == 'one') datas_json.push({id: 3, name: dataId, iAmId: 2, version: 1, ideaId: 1, content: dataId + " content"});
		res.send({data: datas_json, accessId : accessId});
	}else{
		// http://sequelizejs.com/documentation
		var findObj = {
			where: {ideaId: '1'}, /* id: '80', */
			attributes: ['id', 'name', 'iAmId', 'version', 'ideaId', 'createdAt'],
			// http://sequelizejs.com/docs/latest/models
			limit: LIMIT_NO, order: [['createdAt', 'DESC'], ['iAmId', 'DESC'], ['id', 'ASC']]
		};
		if(nameLike){
			findObj['where']['name'] = {like: '%'+nameLike+'%'};
		}
		if(dataId){
			findObj['where']['id'] = dataId;
		}

		if(dataId){
		  	global.db.Data.find(findObj)
			.success(function(data) {
				if(data){
					var datas_json = [];
					dataOut = {id: data.id, sourceid: data.sourceid, name: data.name, iAmId: data.iAmId, version: data.version, ideaId: data.ideaId, dateFirstPublished: data.dateFirstPublished};
		      		datas_json.push(dataOut);
			    	console.log("[modules/data.js:index] Loaded data: %s", JSON.stringify(data));
			    	
			    	// Sequelize doesn't support composite key :(
					var findObj = {
						where: {dataId: dataId, version: 1, componentIndex: 3},
						attributes: ['content'],
						// http://sequelizejs.com/docs/latest/models
						limit: 1
					};
				  	global.db.ComponentTextLong.findAll(findObj).success(function(componentTextLongs) {
				  		if(componentTextLongs.length < 1){
				  			var msg = "error retrieving componentTextLong (no componentTextLong for where: "+findObj['where']+")";
					    	console.log(msg);
					    	res.send(msg);			  			
				  		}
				  		var componentTextLong = componentTextLongs[0];
				  		dataOut.content = componentTextLong.content;
						res.send({data: datas_json, accessId : accessId});
				  	}).error(function(err) {
			    		console.log(err);
			    		res.send("error retrieving componentTextLong");
					});
				}else{
					var msg = "error retrieving data (no data for dataId: "+dataId+")";
		    		console.log(msg);
		    		res.send(msg);
				}
			}).error(function(err) {
		    	console.log(err);
		    	res.send("error retrieving datas");
			});
		}else{
		  	global.db.Data.findAll(findObj)
			.success(function(datas) {
				var datas_json = [];
		    	datas.forEach(function(data) {
		      		datas_json.push({id: data.id, sourceid: data.sourceid, name: data.name, iAmId: data.iAmId, version: data.version, ideaId: data.ideaId, dateFirstPublished: data.dateFirstPublished});
		    	});
		    	console.log("Loaded datas length: %d", datas_json.length);
			    //console.log("Loaded datas: %s", JSON.stringify(datas_json));
		    	// Uses views/datas.ejs
		    	//res.render("datas", {datas: datas_json});
				res.send({data: datas_json, accessId : accessId});
			}).error(function(err) {
		    	console.log(err);
		    	res.send("error retrieving datas");
			});
		}
	}
	accessId ++;
};
