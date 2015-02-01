/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("IAmUser", {
		id: {type: DataTypes.INTEGER, unique: true, allowNull: false},
		firstname: {type: DataTypes.STRING},
		familyname: {type: DataTypes.STRING},
		e_mail: {type: DataTypes.STRING},
		passw: {type: DataTypes.STRING},
		displayName: {type: DataTypes.STRING},
		gender: {type: DataTypes.INTEGER},
		birthday: {type: DataTypes.DATE},
		coordX: {type: DataTypes.INTEGER},
		coordY: {type: DataTypes.INTEGER},
		locationType: {type: DataTypes.INTEGER},
		mySearchAreaVisible: {type: DataTypes.INTEGER},
		myLocationVisible: {type: DataTypes.INTEGER},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE},
		accessedAt: {type: DataTypes.DATE},
		locationUpdatedAt: {type: DataTypes.DATE},
		language: {type: DataTypes.STRING},
		origin: {type: DataTypes.STRING}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'iam_user'
  });
};
