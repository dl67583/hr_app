const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Department.associate = (models) => {
    Department.belongsTo(models.User, { foreignKey: 'headOfDepartmentId' });
  };

  return Department;
};
