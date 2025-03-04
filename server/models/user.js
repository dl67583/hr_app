const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.DATEONLY, allowNull: false },
    hourlyPay: { type: DataTypes.STRING },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
    departmentId: { type: DataTypes.INTEGER, allowNull: true }, // ✅ Link users to a department
    daysOff: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }, // ✅ Track days off
    sickDaysTaken: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false } // ✅ Track sick days
  });

  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: "userId",
      as: "Roles",
    });
    User.belongsTo(models.Department, { foreignKey: "departmentId", as: "Department" });
  };



  return User;
};
