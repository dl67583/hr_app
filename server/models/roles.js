// roles.js (updated)
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM('superadmin', 'hr', 'manager', 'teamLead', 'employee'), 
      allowNull: false,
    },
  }, {
   timestamps: false, // Disable timestamps
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "Users",
    });
    
    Role.belongsToMany(models.Project, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      as: 'Projects',
    });
    Role.belongsToMany(models.Department, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      as: 'Departments',
    });
    Role.hasMany(models.RolePermission, {
      foreignKey: 'roleId',
      as: 'Permissions',
    });
  };

  return Role;
};
