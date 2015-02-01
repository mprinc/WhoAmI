process.chdir(__dirname);

var async   = require('async')
  , express = require('express')
  , resource = require('express-resource')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models')
  , passport 	 = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , flash 	 = require('connect-flash')
  , passportConfig = require('./config/passport')(passport) // pass passport for configuration
  , globalConfig = {authenticate: false};

console.log("[BukvikWebBackend.js:index] passportConfig: %s", JSON.stringify(passportConfig));
console.log("[BukvikWebBackend.js:index] globalConfig: %s", JSON.stringify(globalConfig));

function supportCrossOriginScript(req, res, next) {
	res.header("Access-Control-Allow-Headers", "Content-Type");
	
	// res.header("Access-Control-Allow-Headers", "Origin");
	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// res.header("Access-Control-Allow-Methods","POST, OPTIONS");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
	res.header("Allow", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
	// res.header("Access-Control-Max-Age","1728000");
	
	// res.header("Access-Control-Allow-Origin", "*");
	// http://stackoverflow.com/questions/15026016/set-cookie-in-http-header-is-ignored-with-angularjs
	var origin = req.headers.origin; // "litterra.info"; // "litterra.info:8088"; //req.headers.origin;
	console.log("Access-Control-Allow-Origin: %s", origin);
	//var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	// console.log("Access-Control-Allow-Origin: %s", ip);
	console.log("Access-Control-Allow-Origin: %s", origin);
	res.header('Access-Control-Allow-Origin', origin);
	res.header('Access-Control-Allow-Credentials', true);
	
	console.log("[supportCrossOriginScript] setting up headers");

    res.status(200);
    next();
}

var app = express();

// http://stackoverflow.com/questions/14061644/jquery-ajax-post-request-with-node-js-and-express
// http://stackoverflow.com/questions/16498256/posting-json-to-express-using-jquery
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.logger());
	app.use(express.cookieParser()); // cookie parser is used before the session
	app.use(express.session({secret: '1234567890QWERTY'})); // this provides a little more security for our session data
	//app.use(express.session({ secret: 'keyboard cat' }));
	app.set('port', process.env.PORT || 8088);
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());

// this is enough
app.use(supportCrossOriginScript);
// so no need for this
// app.options('/iam/users', supportCrossOriginScript);

    app.use(app.router);
});

var ideas = app.resource('ideas/ideas', require('./modules/datatalks/idea/idea'), {id: 'type?/:searchParam?'});
var ideaDecoration = app.resource('ideas/idea-decorations', require('./modules/datatalks/idea/ideaDecoration'), {id: 'type?/:searchParam?'});
var datas = app.resource('datas', require('./modules/datatalks/data'), {id: 'ideaId?/:type?/:searchParam?.json'});
var experiments = app.resource('experiments', require('./modules/experiment'), {id: 'type?/:searchParam?'});
var experimentParams = app.resource('experiment-params', require('./modules/experiment-params'), {id: 'type?/:searchParam?'});

var datasets = app.resource('datasets', require('./modules/dataset'), {id: 'type?/:projectName?/:searchParam?'});

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/datas',
                                   failureRedirect: '/login' }));
// Render example.com/orders
/*app.get('/hits', function(req, res) {
  global.db.Hit.findAll().success(function(hits) {
    var hits_json = [];
    hits.forEach(function(hit) {
      hits_json.push({id: hit.id, entityPosX: hit.entityPosX, entityPosY: hit.entityPosY, partHit: hit.partHit});
    });
    console.log("Loaded hits: %s", JSON.stringify(hits_json));
    res.render("hits", {hits: hits_json});
  }).error(function(err) {
    console.log(err);
    res.send("error retrieving hits");
  });
});
*/
var test = {
	db: false
};

http.createServer(app).listen(app.get('port'), function() {
	console.log("Listening on " + app.get('port'));
	if(test.db){
		global.db.Hit.findAll().success(function(hits) {
	    	var hits_json = [];
	    	hits.forEach(function(hit) {
	      		hits_json.push({id: hit.id, entityPosX: hit.entityPosX, entityPosY: hit.entityPosY, partHit: hit.partHit});
	    	});
		    console.log("Loaded hits: %s", JSON.stringify(hits_json));
			//res.render("hits", {hits: hits_json});
	  	}).error(function(err) {
	    	console.log(err);
	    	//res.send("error retrieving hits");
	  	});
	}
});