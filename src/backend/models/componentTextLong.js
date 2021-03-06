/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("ComponentTextLong.js", {
		dataId: {type: DataTypes.INTEGER, unique: true, allowNull: false},
		version: {type: DataTypes.INTEGER},
		componentIndex: {type: DataTypes.INTEGER},
		content: {type: DataTypes.STRING}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'componentTextLong'
  });
};
