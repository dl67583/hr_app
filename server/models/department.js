const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
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
    Department.hasMany(models.Project, {
      foreignKey: 'departmentId',
      as: 'projects',
    });
    Department.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'departmentId',
      as: 'Roles',
    });
    Department.hasMany(models.User, {
      foreignKey: 'departmentId',
      as: 'users',
      onDelete:"NO ACTION"
    });
    Department.belongsTo(models.User, {
      foreignKey: 'departmentHead',
      as: 'head',
    });
  };

  return Department;
};
