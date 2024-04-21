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
    Candidate.belongsToMany(models.Meeting,{through:"meetingCandidate"})

  };

  return Candidate;
};
