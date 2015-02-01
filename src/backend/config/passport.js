'use strict';

var http    = require( "http" );

// config/passport.js

var EXTERNAL_TYPE_ID_FACEBOOK = 0;
var LIMIT_NO = 25;

var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;


// load up the user model
//var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		console.log("[config/passport.serializeUser] Serializing user: %s", JSON.stringify(user));
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(userId, done) {
    	console.log("[config/passport.deserializeUser] Deserializing user for userId: %s", userId);
		var findObj = {
			where: {'id': userId}, // just a placeholder
			attributes: ['id', 'firstname', 'familyname', 'e_mail', 'passw', 'displayName', 'gender', 'birthday', 'coordX', 'coordY', 'locationType', 
			'mySearchAreaVisible', 'myLocationVisible', 'createdAt', 'updatedAt', 'accessedAt', 'locationUpdatedAt', 'language', 'origin'],
			// http://sequelizejs.com/docs/latest/models
			limit: LIMIT_NO, order: [['familyname', 'DESC'], ['firstname', 'DESC'], ['id', 'ASC']]
		};

	  	global.db.IAm.User.find(findObj)
		.success(function(user) {
			if(user){
		    	console.log("[config/passport.deserializeUser:global.db.IAm.User.find:callback] Loaded user: %s", JSON.stringify(user));
		    	
		    	// Sequelize doesn't support composite key :(
				var findObj = {
					where: {iamId: userId},
					attributes: ['iamId', 'externalTypeId', 'externalId', 'credentials'],
					// http://sequelizejs.com/docs/latest/models
					limit: 1
				};
			  	global.db.IAm.ExternalUser.findAll(findObj).success(function(externalUsers) {
			  		if(externalUsers.length < 1){
			  			var msg = "No (0) externalUsers for where: "+findObj['where']+")";
				    	console.log(msg);
			  		}
			  		var externalUsersObj = {};
			  		for(var i=0; i<externalUsers.length; i++){
			  			var externalUser = externalUsers[i];
			  			externalUsersObj[externalUser.externalTypeId] = externalUser;
			  		}
			  		user.externalUsers = externalUsersObj;
			    	console.log("[config/passport.deserializeUser] User is deserialized: %s", JSON.stringify(user));

					if(global.authentication.pushMedium === "cookie"){
						// pushing token to the client
						var keys = undefined;
					}

	  		        done(null, user);
			  	}).error(function(err) {
		    		console.log(err);
	  		        done(err, false, { message: 'Error retrieving externalUsers' });
				});
			}else{
				var msg = "No (0) user for userId: "+userId+")";
	    		console.log(msg);
  		        done(null, false, { message: msg });
			}
		}).error(function(err) {
	    	console.log(err);
	        done(err, false, { message: 'error retrieving users' });
		});    	
    });

	passport.use(new FacebookStrategy({
			clientID: "343737659027169",
			clientSecret: "8a20180c8ef07d5bc0527a2b09aa5e6d",
			callbackURL: "http://www.cvrkut.org:8080/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			console.log("[config::passport.js::passport.use::callback] accessToken=%s, refreshToken=%s, profile=%s", accessToken, refreshToken, JSON.stringify(profile));
	
			var findObj = {
				where: {externalId: profile.id, externalTypeId: EXTERNAL_TYPE_ID_FACEBOOK},
				attributes: ['iamId'],
				// http://sequelizejs.com/docs/latest/models
				limit: 1
			};
		  	global.db.IAm.ExternalUser.findAll(findObj).success(function(externalUsers) {
		  		if(externalUsers.length < 1){
		  			var msg = "No (0) externalUsers for externalTypeId: "+EXTERNAL_TYPE_ID_FACEBOOK+" and externalId: "+profile.id;
		    		console.log(msg);
	  		        done(null, false, { message: msg });
		  		}else{
		  			var userId = externalUsers[0].iamId;
					var findObj = {
						where: {'id': userId},
						attributes: ['id', 'firstname', 'familyname', 'e_mail', 'passw', 'displayName', 'gender', 'birthday', 'coordX', 'coordY', 'locationType', 
						'mySearchAreaVisible', 'myLocationVisible', 'createdAt', 'updatedAt', 'accessedAt', 'locationUpdatedAt', 'language', 'origin'],
						// http://sequelizejs.com/docs/latest/models
						limit: LIMIT_NO, order: [['familyname', 'DESC'], ['firstname', 'DESC'], ['id', 'ASC']]
					};
			
				  	global.db.IAm.User.find(findObj)
					.success(function(user) {
						if(user){
					    	console.log("[config/passport.use] Loaded user: %s", JSON.stringify(user));
					    	
					    	// Sequelize doesn't support composite key :(
							var findObj = {
								where: {iamId: userId},
								attributes: ['iamId', 'externalTypeId', 'externalId', 'credentials'],
								// http://sequelizejs.com/docs/latest/models
								limit: 1
							};
						  	global.db.IAm.ExternalUser.findAll(findObj).success(function(externalUsers) {
						  		if(externalUsers.length < 1){
						  			var msg = "No (0) externalUsers for where: "+findObj['where']+")";
							    	console.log(msg);
						  		}
						  		var externalUsersObj = {};
						  		for(var i=0; i<externalUsers.length; i++){
						  			var externalUser = externalUsers[i];
						  			externalUsersObj[externalUser.externalTypeId] = externalUser;
						  		}
						  		user.externalUsers = externalUsersObj;
						    	console.log("[config/passport.use] User is recognized: %s", JSON.stringify(user));
				  		        done(null, user);
						  	}).error(function(err) {
					    		console.log(err);
				  		        done(err, false, { message: 'Error retrieving externalUsers' });
							});
						}else{
							var msg = "No (0) user for userId: "+userId+")";
				    		console.log(msg);
			  		        done(null, false, { message: msg });
						}
					}).error(function(err) {
				    	console.log(err);
				        done(err, false, { message: 'error retrieving users' });
					});    	
		  			
		  		}
		  	}).error(function(err) {
	    		console.log(err);
  		        done(err, false, { message: 'Error retrieving externalUser' });
			});
		}
	));
};