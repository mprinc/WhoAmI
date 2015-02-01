// http://localhost:8080/ideas
var mockup = {db: {idea:false}};
var accessId = 0;
var LIMIT_NO = 25;

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
	if(isSetAny('mockup.db.data')){
		var datas_json = [];
  		datas_json.push({id: 1, entityPosX: 59.969408, entityPosY: 10.563519, partdata: "Тихо ноћи моје чедо спава (back-mockup)"});
  		datas_json.push({id: 2, entityPosX: 59.959408, entityPosY: 10.763519, partdata: "а над главом од бисера грана (back-mockup)"});
  		datas_json.push({id: 3, entityPosX: 59.979408, entityPosY: 10.963519, partdata: "А на грани к'о да нешто бруји (back-mockup)"});
  		datas_json.push({id: 4, entityPosX: 59.999408, entityPosY: 10.663519, partdata: "то су мали, сићани славуји (back-mockup)"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}else{
		var type = req.params.type;
		var ideaId = null;
		var ideaDecorationId = null;
		console.log("type: %s", type);
		switch(type){
			case 'idea':
				ideaId = req.params.searchParam;
				console.log("ideaId: %s", ideaId);
				break;
			case 'one':
				ideaDecorationId = req.params.searchParam;
				console.log("ideaDecorationId: %s", ideaDecorationId);
				break;
		}
		// http://sequelizejs.com/documentation
		var findObj = {
			where: {}, // placeholder for later parameters
			attributes: ['id', 'ideaId', 'decoratingIdeaId', 'iAmId', 'name', 'title', 'createdAt', 'updatedAt'],
			// http://sequelizejs.com/docs/latest/models
			// limit: LIMIT_NO, 
			order: [['title', 'ASC']],
			include: [
				{ model: global.db.Ideas.Idea, as: 'Idea', foreignKey: 'ideaId', attributes: ['id', 'name']}
				, { model: global.db.Ideas.Idea, as: 'DecoratingIdea', foreignKey: 'decoratingIdeaId', attributes: ['id', 'name']}
			]
		};
		if(ideaId){
			findObj['where']['ideaId'] = ideaId;
		}
		if(ideaDecorationId){
			findObj['where']['id'] = ideaDecorationId;
		}
		global.db.Ideas.IdeaDecoration.findAll(findObj)
		.success(function(ideaDecorations) {
			var ideaDecorations_json = [];
			ideaDecorations.forEach(function(ideaDecoration) {
				if(!ideaDecoration.idea){
					console.log("Missing idea in ideaDecoration: %s", JSON.stringify(ideaDecoration));
				}
				var ideaDecorations = {
					id: ideaDecoration.id, 
					ideaId: ideaDecoration.ideaId,
					idea: ideaDecoration.idea ? 
						{
							id: ideaDecoration.idea.id,
							name: ideaDecoration.idea.name
						}
						: null,
					decoratingIdeaId: ideaDecoration.decoratingIdeaId, 
					decoratingIdea: ideaDecoration.decoratingIdea ? 
						{
							id: ideaDecoration.decoratingIdea.id,
							name: ideaDecoration.decoratingIdea.name
						}
						: null,
					iAmId: ideaDecoration.iAmId,
					name: ideaDecoration.name,
					title: ideaDecoration.title,
					createdAt: ideaDecoration.createdAt,
					updatedAt: ideaDecoration.updatedAt
				};
				ideaDecorations_json.push(ideaDecorations);
			});
			console.log("Loaded ideaDecorations length: %d", ideaDecorations_json.length);
			//console.log("Loaded ideaDecorations: %s", JSON.stringify(ideaDecorations_json));
			resSendJsonProtected(res, {data: ideaDecorations_json, accessId : accessId});
		}).error(function(err) {
			console.log(err);
			resSendJsonProtected(res, "error retrieving ideas");
		});
	}
	accessId ++;
};

exports.create = function(req, res){
	console.log("[modules/ideaDecoration.js:create] req.body: %s", JSON.stringify(req.body));
	var ideaDecoration = req.body;
	var idea = ideaDecoration.idea ? ideaDecoration.idea : {};
	console.log("[modules/ideaDecoration.js:create] idea: %s", JSON.stringify(idea));
	var decoratingIdea = ideaDecoration.decoratingIdea ? ideaDecoration.decoratingIdea : {};
	console.log("[modules/ideaDecoration.js:create] decoratingIdea: %s", JSON.stringify(decoratingIdea));
	var ideaDecorationCreate = {};
	ideaDecorationCreate['ideaId']= ideaDecoration['ideaId'];
	ideaDecorationCreate['decoratingIdeaId']= ideaDecoration['decoratingIdeaId'];
	ideaDecorationCreate['iAmId']= ideaDecoration['iAmId'];
	ideaDecorationCreate['name']= ideaDecoration['name'];
	ideaDecorationCreate['title']= ideaDecoration['title'];

	// http://sequelizejs.com/docs/latest/models#block-26-line-1
	global.db.Ideas.IdeaDecoration.create(ideaDecorationCreate)
		.success(function(ideaDecoration){
			// TODO: find a way to get an id of AUTOINCREMENT column
			var ideaDecorationCreated = {};
			ideaDecorationCreated.id = ideaDecoration.id;
			ideaDecorationCreated.ideaId = ideaDecoration.ideaId;
			ideaDecorationCreated.idea = idea;
			ideaDecorationCreated.decoratingIdeaId = ideaDecoration.decoratingIdeaId;
			ideaDecorationCreated.decoratingIdea = decoratingIdea;
			ideaDecorationCreated.iAmId = ideaDecoration.iAmId;
			ideaDecorationCreated.name = ideaDecoration.name;
			ideaDecorationCreated.title = ideaDecoration.title;
			ideaDecorationCreated.updatedAt = ideaDecoration.updatedAt;
			ideaDecorationCreated.createdAt = ideaDecoration.createdAt;
			console.log("[modules/ideaDecoration.js:create] ideaDecoration (id:%s, id:%s) for idea(id:%d, name:%s) and decoratingIdea(id:%d, name:%s) created: %s",
				ideaDecorationCreate.id, ideaDecoration.id, idea.id, idea.name, decoratingIdea.id, decoratingIdea.name, JSON.stringify(ideaDecorationCreated));
			resSendJsonProtected(res, {success: true, data: ideaDecorationCreated, accessId : accessId});
		}).error(function(error) {
			console.error("++++++++++");
			console.error("[modules/ideaDecoration.js:create] ideaDecoration (id:%s) for tag(id:%d, name:%s) not created. Error: %s", ideaDecoration.id, tag.id, tag.name, error);
			//done();
			resSendJsonProtected(res, "error finding/creating tag");
		});
};

// https://github.com/sequelize/sequelize/wiki/API-Reference-Model#destroywhere-options----promiseundefined
exports.destroy = function(req, res){
	console.log("[modules/iam/ideaDecoration:destroy] req.body: %s", JSON.stringify(req.body));
	var type = req.params.type;
	var ideaDecorationId = req.params.searchParam;
	
	global.db.Ideas.IdeaDecoration.destroy({ id: ideaDecorationId })
		.success(function(){
			console.log("[modules/iam/ideaDecoration:destroy] ideaDecoration (%d) deleted", ideaDecorationId);
			//done();
			resSendJsonProtected(res, {success: true, ideaDecorationId: ideaDecorationId, accessId : accessId});
		}).error(function(error) {
			console.log("++++++++++");
			console.log("[modules/iam/ideaDecoration:destroy] error: %ss", error);
			//done();
			resSendJsonProtected(res, "error saving idea");
		});
};