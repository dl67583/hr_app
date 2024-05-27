const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hoursWorked: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    regularHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    overtimeHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weekendHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nightHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPayment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
  };

  return Payment;
};
