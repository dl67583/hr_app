const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Candidate = sequelize.define(
    "Candidate",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  Candidate.associate = (models) => {
    // Candidate.belongsToMany(models.Meeting, {
    //   through: "meetingCandidate",
    //   foreignKey: "CandidateId", // Foreign key in the join table referencing Candidate
    //   otherKey: "MeetingId", // Foreign key in the join table referencing Meeting
    //   primaryKey: true // Specify that this foreign key is part of the composite primary key
    // });
    
  };

  return Candidate;
};