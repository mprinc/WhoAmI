/* Object/Relational mapping for instances of the Hit class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the database hit table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
	return sequelize.define("TagRelation", {
		id: {type: DataTypes.INTEGER, unique: true, allowNull: false},
		dataId: {type: DataTypes.INTEGER},
		ideaId: {type: DataTypes.INTEGER},
		//tagId: {type: DataTypes.INTEGER},
		// set relationship (hasOne) with `Series`
		// http://sequelizejs.com/docs/latest/associations#block-12-line-23
		tagId: {
			type: DataTypes.INTEGER,
			references: "Tag",
			referencesKey: "id"
		},
		iAmId: {type: DataTypes.INTEGER},
		createdAt: {type: DataTypes.DATE},
		updatedAt: {type: DataTypes.DATE}
	}, {
		// either one is good enough
		freezeTableName: true,
		tableName: 'tagRelation'
	});
};