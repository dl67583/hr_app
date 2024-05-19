const {DataTypes} = require ("sequelize")


module.exports = function(sequelize, DataTypes) {
    const DepartmentProject = sequelize.define('DepartmentProject', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
      },
      departmentId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'department',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        // unique: 'unique-department-per-project'
      },
      projectId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'project',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        // unique: 'unique-depart-per-user'
      },
    }, {
      timestamps: true,
      underscored: true,
      tableName: 'DepartmentProjects'
    });
  

    DepartmentProject.associate = (models) => {
      DepartmentProject.belongsTo(models.Department, { foreignKey: 'departmentId', targetKey: 'id', as: 'Department' });
      DepartmentProject.belongsTo(models.Project, { foreignKey: 'projectId', targetKey: 'id', as: 'Project' });
    }

    return DepartmentProject;
  };