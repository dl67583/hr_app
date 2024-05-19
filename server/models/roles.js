const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement:true
        },
      name: {
        type: DataTypes.ENUM,
        values: ['regular', 'hr', 'superadmin'],
        primaryKey: true,
      },
    }, {});

    Role.associate = (models) => {
        Role.belongsToMany(models.User, { as: 'UserRoles', through: models.UserRole, foreignKey: 'roleId'});

      }

  return Role;
};