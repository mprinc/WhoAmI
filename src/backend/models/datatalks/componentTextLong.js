/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("ComponentTextLong", {
		// id: {type: DataTypes.INTEGER, unique: false, allowNull: true}, // Sequelize needs it :(
		dataId: {type: DataTypes.INTEGER, unique: false, allowNull: false, primaryKey: true},
		version: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
		componentIndex: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
		content: {type: DataTypes.STRING}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'componentTextLong'
  });
};
