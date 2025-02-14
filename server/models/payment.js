const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define("Payment", {
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
        model: "Users",
        key: "id",
      },
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hoursWorked: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPayment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Payment;
};
