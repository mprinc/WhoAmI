'use strict';

/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AktivitiRecord", {
		id: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
		NsN: {type: DataTypes.STRING},
		iAmId: {type: DataTypes.INTEGER, allowNull: false},
		previous: {type: DataTypes.INTEGER},
		isPublic: {type: DataTypes.BOOLEAN},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'aktivitiRecord'
  });
};
