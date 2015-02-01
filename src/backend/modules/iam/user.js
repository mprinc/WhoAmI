// http://localhost:8080/users
var mockup = {db: {user:false}};
var accessId = 0;
var LIMIT_NO = 25;

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
		res.send({user: users_json, accessId : accessId});
	}else{
		var type = req.params.type;
		var userId = null;
		var nameLike = null;
		console.log("type: %s", type);
		switch(type){
			case 'many-name':
				nameLike = req.params.searchParam;
				console.log("nameLike: %s", nameLike);
				break;
			case 'one':
				userId = req.params.searchParam;
				break;
		}
		// http://sequelizejs.com/documentation
		var findObj = {
			where: {}, // just a placeholder
			attributes: ['id', 'firstname', 'familyname', 'e_mail', 'passw', 'displayName', 'gender', 'birthday', 'coordX', 'coordY', 'locationType', 
			'mySearchAreaVisible', 'myLocationVisible', 'createdAt', 'updatedAt', 'accessedAt', 'locationUpdatedAt', 'language', 'origin'],
			// http://sequelizejs.com/docs/latest/models
			limit: LIMIT_NO, order: [['familyname', 'DESC'], ['firstname', 'DESC'], ['id', 'ASC']]
		};
		if(nameLike){
			findObj['where']['name'] = {like: '%'+nameLike+'%'};
		}
		if(userId){
			findObj['where']['id'] = userId;
		}

		if(userId){
		  	global.db.IAm.User.find(findObj)
			.success(function(user) {
				if(user){
					var users_json = [];
					userOut = {id: user.id, firstname: user.firstname, familyname: user.familyname, e_mail: user.e_mail, passw: user.passw, displayName: user.displayName, gender: user.gender,
						birthday: user.birthday, coordX: user.coordX, coordY: user.coordY, locationType: user.locationType, mySearchAreaVisible: user.mySearchAreaVisible, myLocationVisible: user.myLocationVisible, 
						createdAt: user.createdAt, updatedAt: user.updatedAt, accessedAt: user.accessedAt, locationUpdatedAt: user.locationUpdatedAt, language: user.language, origin: user.origin};
		      		users_json.push(userOut);
			    	console.log("[modules/iam/user.js:index] Loaded user: %s", JSON.stringify(user));
			    	
			    	// Sequelize doesn't support composite key :(
					var findObj = {
						where: {iamId: userId},
						attributes: ['iamId', 'externalTypeId', 'externalId', 'credentials'],
						// http://sequelizejs.com/docs/latest/models
						limit: LIMIT_NO
					};
				  	global.db.IAm.ExternalUser.findAll(findObj).success(function(externalUsers) {
				  		externalUsersObj = {};
				  		if(externalUsers.length < 1){
				  			var msg = "error retrieving externalUsers (no externalUsers for where: "+findObj['where']+")";
					    	console.log(msg);
					  		//userOut.externalUsers = null;
				  		}else{
					  		for(var i=0; i<externalUsers.length; i++){
					  			var externalUser = externalUsers[i];
					  			externalUsersObj[externalUser.externalTypeId] = externalUser;
					  		}
				  		}
				  		userOut.externalUsers = externalUsersObj;
						res.send({user: users_json, accessId : accessId});				  			
				  	}).error(function(err) {
			    		console.log(err);
			    		res.send("error retrieving externalUsers");
					});
				}else{
					var msg = "error retrieving user (no user for userId: "+userId+")";
		    		console.log(msg);
		    		res.send(msg);
				}
			}).error(function(err) {
		    	console.log(err);
		    	res.send("error retrieving users");
			});
		}else{
		  	global.db.IAm.User.findAll(findObj)
			.success(function(users) {
				var users_json = [];
		    	users.forEach(function(user) {
		      		users_json.push({id: user.id, sourceid: user.sourceid, name: user.name, iAmId: user.iAmId, version: user.version, ideaId: user.ideaId, dateFirstPublished: user.dateFirstPublished});
		    	});
		    	console.log("Loaded users length: %d", users_json.length);
			    //console.log("Loaded users: %s", JSON.stringify(users_json));
		    	// Uses views/users.ejs
		    	//res.render("users", {users: users_json});
				res.send({user: users_json, accessId : accessId});
			}).error(function(err) {
		    	console.log(err);
		    	res.send("error retrieving users");
			});
		}
	}
	accessId ++;
};
