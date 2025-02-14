const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define("Role", {
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

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: "roleId",
      as: "Users"
    });

    Role.hasMany(models.RolePermission, { foreignKey: "roleId", as: "Permissions" });
    Role.hasMany(models.EntityRoleAssignment, { foreignKey: "roleId", as: "EntityRoles" });
  };

  return Role;
};
