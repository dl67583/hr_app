const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('regular user', 'admin'),
      allowNull: false,
      defaultValue: 'regular user'
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Department, { foreignKey: 'departmentId' });
    // !============================================================
    // User.hasMany(models.TimeAttendance, { foreignKey: 'userId' });
    // User.hasMany(models.Meeting, { foreignKey: 'attendants' });
    // User.hasMany(models.Request, { foreignKey: 'userId' });
    // per me vone
    //! ========================================================
  };

  return User;
};
