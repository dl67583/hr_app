const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Departments',
        key: 'id',
      },
    },
  });

  Project.associate = (models) => {
    Project.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
      onDelete:"NO ACTION"

    });
    Project.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'projectId',
      as: 'Roles',
    });
  };

  return Project;
};
