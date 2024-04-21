const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Meeting = sequelize.define("Meeting", {
    date_and_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Meeting.associate = (models) => {
    Meeting.belongsToMany(models.User,{through:"meetingUser"}),
    Meeting.belongsToMany(models.Candidate,{through:"meetingCandidate"})
    
  };

  return Meeting;
};
