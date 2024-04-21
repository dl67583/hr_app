const { DataTypes } = require('sequelize');
const db = require("../models")

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    }
  },
  
  {
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ]
});

  Department.associate = (models) => {
    Department.belongsTo(models.User, { foreignKey: 'headOfDepartmentId' , onDelete:"NO ACTION", allowNull: true});

  };

  return Department;
};
