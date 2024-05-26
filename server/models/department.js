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
    Department.belongsToMany(models.Project, {
      through: models.DepartmentProject,
      foreignKey: 'departmentId',
      as: 'Projects'
    });
    Department.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'departmentId',
      as: 'Roles'
    });
  };

  return Department;
};
