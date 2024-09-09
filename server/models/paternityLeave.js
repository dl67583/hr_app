const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaternityLeave = sequelize.define('PaternityLeave', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      field: 'userId',
    },
  });

  PaternityLeave.associate = (models) => {
    PaternityLeave.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    PaternityLeave.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });
  };

  return PaternityLeave;
};
