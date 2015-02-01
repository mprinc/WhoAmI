/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("IdeaDecoration", {
		// ideaId: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
		id: {type: DataTypes.INTEGER, unique: true, allowNull: false, autoIncrement: true, primaryKey: true },
		ideaId: {
			type: DataTypes.INTEGER
			, allowNull: false
			//, references: "Idea"
			//, referencesKey: "id"
		},
		//decoratingIdeaId: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
		decoratingIdeaId: {
			type: DataTypes.INTEGER
			, allowNull: false
			//, references: "Idea"
			//, referencesKey: "id"
		},
		iAmId: {type: DataTypes.INTEGER, allowNull: false},

		name: {type: DataTypes.STRING},
		title: {type: DataTypes.STRING},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE}
  	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'ideaDecoration'
  });
};
