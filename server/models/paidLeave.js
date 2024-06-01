const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaidLeave = sequelize.define('PaidLeave', {
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
  });

  PaidLeave.associate = (models) => {
    PaidLeave.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    PaidLeave.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });
  };

  return PaidLeave;
};
