/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Tag", {
		id: {type: DataTypes.INTEGER, unique: true, allowNull: false},
		name: {type: DataTypes.STRING},
		iAmId: {type: DataTypes.INTEGER},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE}
	}, {
		// https://github.com/sequelize/sequelize/issues/94
		// either one is good enough
		freezeTableName: true,
		tableName: 'tag'
	});
};
