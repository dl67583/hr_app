const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MedicalLeave = sequelize.define('MedicalLeave', {
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

  MedicalLeave.associate = (models) => {
    MedicalLeave.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    MedicalLeave.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });
  };

  return MedicalLeave;
};
