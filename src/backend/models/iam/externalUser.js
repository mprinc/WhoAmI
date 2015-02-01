/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("IAmExternalUser", {
		// primary key (not supported in Sequelize as a multy-column)
			iamId: {type: DataTypes.INTEGER, allowNull: false},
			externalTypeId: {type: DataTypes.INTEGER, allowNull: false},
		externalId: {type: DataTypes.STRING},
		credentials: {type: DataTypes.STRING}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'iam_external_user'
  });
};
