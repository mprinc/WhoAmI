'use strict';

/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Idea", {
		id: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
		name: {type: DataTypes.STRING},
		title: {type: DataTypes.STRING},
		iAmId: {type: DataTypes.INTEGER, allowNull: false},
		schemaSerialized: {type: DataTypes.STRING},
		defaultDataContentSerialized: {type: DataTypes.STRING},
		stateSchemaSerialized: {type: DataTypes.STRING},
		defaultStateContentSerialized: {type: DataTypes.STRING},
		isPublic: {type: DataTypes.BOOLEAN},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'idea'
  });
};
