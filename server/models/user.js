const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hourlyPay: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email", "username"],
        },
      ],
    }
  );

  User.associate = (models) => {
    User.hasMany(models.TimeAttendance, {
      foreignKey: "userId",
   
    });

    User.hasMany(models.Request, {
      foreignKey: "userId",
   
    });
    User.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });
    User.belongsToMany(models.Role, {
      as: "UserRoles",
      through: models.UserRole,
      foreignKey: "userId",
    });
  };

  return User;
};
