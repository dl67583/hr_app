module.exports = (sequelize, DataTypes) => {
  const TimeAttendance = sequelize.define(
    "TimeAttendance",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "timeattendance", // ✅ Explicitly set table name
      timestamps: true,
    }
  );

  TimeAttendance.associate = (models) => {
    TimeAttendance.belongsTo(models.User, { foreignKey: "userId" });
  };

  return TimeAttendance;
};
