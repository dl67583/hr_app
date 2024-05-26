const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    permission: {
      type: DataTypes.ENUM,
      values: ['read', 'write', 'delete', 'update'], // Add all permission types here
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    columns: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'Role'
    });
    RolePermission.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'Project'
    });
    RolePermission.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'Department'
    });
  };

  return RolePermission;
};
