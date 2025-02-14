const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Department = sequelize.define("Department", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Department.associate = (models) => {

    Department.hasMany(models.User, {
      foreignKey: "departmentId",
      as: "users",
    });
    Department.hasMany(models.EntityRoleAssignment, {
      foreignKey: "entityId",
      constraints: false,
      scope: {
        entityType: "department",
      },
    });
  };

  return Department;
};
