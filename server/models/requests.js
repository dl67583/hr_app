const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define("Request", {
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
    typeOfRequest: {
      type: DataTypes.ENUM("leave", "equipment", "travel", "training", "other"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  });

  Request.associate = (models) => {
    Request.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Request;
};
