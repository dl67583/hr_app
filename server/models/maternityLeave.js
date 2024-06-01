const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MaternityLeave = sequelize.define('MaternityLeave', {
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

  MaternityLeave.associate = (models) => {
    MaternityLeave.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    MaternityLeave.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });
  };

  return MaternityLeave;
};
