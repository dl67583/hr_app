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
      through: models.UserRole,
      foreignKey: 'roleId', 
      as: 'Users',
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
  };

  return Role;
};
