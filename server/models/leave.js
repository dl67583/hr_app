const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Leave = sequelize.define("Leave", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("paid", "unpaid", "maternity", "paternity", "medical"),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Departments",
        key: "id",
      },
    },
  });

  Leave.associate = (models) => {
    Leave.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Leave.belongsTo(models.Department, { foreignKey: "departmentId", as: "department" });
  };

  return Leave;
};
