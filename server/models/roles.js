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
      type: DataTypes.ENUM('regular', 'hr', 'superadmin'), 
      allowNull: false,
    },
  }, {
   timestamps: false, // Disable timestamps
  });

  Role.associate = (models) => {
   Role.belongsToMany(models.User, {
      through: 'UserRole',
      foreignKey: 'roleId',
      as: 'Users',  // Alias to be used when fetching users
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
