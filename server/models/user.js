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
        type: DataTypes.TEXT,
        refreshToken: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
    },
   },
    {
      indexes: [
        {
          unique: true,
          fields: ["email", "username"],
        },
      ],    }
  );

  User.associate = (models) => {
    User.hasMany(models.TimeAttendance, {
      foreignKey: "userId", // Match snake_case convention
    });

    User.hasMany(models.Request, {
      foreignKey: "userId",
    });
    User.belongsTo(models.Department, {
      foreignKey: "departmentId", 
      allowNull: true,
    });
    User.belongsToMany(models.Role, {
      through: 'UserRole',  // Join table
      foreignKey: 'userId',
      as: 'Roles',  // Alias to be used when fetching roles
    });
  };

  return User;
};
