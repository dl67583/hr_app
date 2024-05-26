const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DepartmentProject = sequelize.define('DepartmentProject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Projects',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });

  DepartmentProject.associate = (models) => {
    DepartmentProject.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'Department'
    });
    DepartmentProject.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'Project'
    });
  };

  return DepartmentProject;
};
