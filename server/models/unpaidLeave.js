const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UnpaidLeave = sequelize.define('UnpaidLeave', {
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
    },
  });

  UnpaidLeave.associate = (models) => {
    UnpaidLeave.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UnpaidLeave.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });
  };

  return UnpaidLeave;
};
