const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TimeAttendance = sequelize.define('TimeAttendance', {
    timeOfEntering: {
      type: DataTypes.TIME,
      allowNull: false
    },
    timeOfLeaving: {
      type: DataTypes.TIME,
      allowNull: false
    }
  });

  return TimeAttendance;
};
