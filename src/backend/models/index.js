if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize');
    var sq = null;
    var fs = require('fs');
    var PGPASS_FILE = '../.pgpass';
    if (process.env.DATABASE_URL) {
        /* Remote database
           Do `heroku config` for details. We will be parsing a connection
           string of the form:
           postgres://bucsqywelrjenr:ffGhjpe9dR13uL7anYjuk3qzXo@\
           ec2-54-221-204-17.compute-1.amazonaws.com:5432/d4cftmgjmremg1
        */
        var pgregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        var match = process.env.DATABASE_URL.match(pgregex);
        var user = 'datatalks'; //match[1];
        var password = 'datatalks_pico!'; //match[2];
        var host = 'localhost'; //match[3];
        var port = '3306'; //match[4];
        var dbname = 'datatalks'; //match[5];
        var config =  {
            dialect:  'mysql',
            port:     port,
            host:     host,
            logging:  true //false
        };
        sq = new Sequelize(dbname, user, password, config);
        console.log("dbname=%s, user=%s, password=%s, config=%s", dbname, user, password, JSON.stringify(config));
    } else {
        /* Local database
           We parse the .pgpass file for the connection string parameters.
        */
        var pgtokens = fs.readFileSync(PGPASS_FILE).toString().split(':');
/*        var host = pgtokens[0];
        var port = pgtokens[1];
        var dbname = pgtokens[2];
        var user = pgtokens[3];
        var password = pgtokens[4];
*/
        var user = 'datatalks'; //match[1];
        var password = 'datatalks_pico!'; //match[2];
        var host = 'localhost'; //match[3];
        var port = '3306'; //match[4];
        var dbname = 'datatalks'; //match[5];

        var config =  {
            dialect:  'mysql',
            port:     port,
            host:     host,
            logging: console.log
        };
        console.log("dbname=%s, user=%s, password=%s, config=%s", dbname, user, password, JSON.stringify(config));
        var sq = new Sequelize(dbname, user, password, config);
    }
	global.db = {
		Sequelize: Sequelize,
		sequelize: sq,
		Ideas: {
			Idea: sq.import(__dirname + '/datatalks/idea/idea'),
			IdeaDecoration: sq.import(__dirname + '/datatalks/idea/ideaDecoration')
		},
		Data: sq.import(__dirname + '/datatalks/data'),		
		IAm: {
			User: sq.import(__dirname + '/iam/user'),
			ExternalUser: sq.import(__dirname + '/iam/externalUser')
		},
		ComponentTextLong: sq.import(__dirname + '/componentTextLong.js'),
		Tag: sq.import(__dirname + '/tag'),
		TagRelation: sq.import(__dirname + '/tagRelation')
	};

	global.db.TagRelation.belongsTo(global.db.Tag, {'as': 'Tag', 'foreignKey': 'tagId'});
	// One-way associations
	// TagRelation -> Tag
	//global.db.Tag.hasOne(global.db.TagRelation, {'as': 'Tag', 'foreignKey': 'tagId'});
	//global.db.TagRelation.hasOne(global.db.Tag, {'as': 'Tag', 'foreignKey': 'id'});
	//global.db.Tag.hasOne(global.db.TagRelation);
	//global.db.TagRelation.hasOne(global.db.Tag, {'as': 'Tag'});
	//global.db.Tag.belongsTo(global.db.TagRelation, {'foreignKey': 'tagId'});
}
module.exports = global.db;