/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/

var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Data", {
		id: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
		version: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
		name: {type: DataTypes.STRING},
		iAmId: {type: DataTypes.INTEGER},
		activeVersion: {type: DataTypes.INTEGER},
		ideaId: {type: DataTypes.INTEGER},
		dataContentSerialized: {type: DataTypes.STRING},
		stateContentSerialized: {type: DataTypes.STRING},
		decoratedDataId: {type: DataTypes.INTEGER},
		isPublic: {type: DataTypes.BOOLEAN},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE}
	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'data',
		classMethods: {
			getDatasById: function(dataIds){
				var deferral = Promise.defer();
				var findObj = {
					where: {id: dataIds, ideaId: '1'}, /* id: '80', */
					attributes: ['id', 'name', 'iAmId', 'version', 'ideaId', 'isPubic', 'decoratedDataId', 'createdAt', 'updatedAt'],
					// http://sequelizejs.com/docs/latest/models
					//limit: LIMIT_NO,
					order: [['createdAt', 'DESC'], ['iAmId', 'DESC'], ['id', 'ASC']]
				};
	
				global.db.Data.findAll(findObj)
				.success(function(datas) {
					console.log("Loaded datas length: %d", datas.length);
					//deferral.reject("[models/data.js] Iskuliraj, samo test!");
					deferral.resolve(datas);
				}).error(function(err) {
					console.log(err);
					deferral.reject(err);
				});
				return deferral.promise;
			}
		}
	});
};
