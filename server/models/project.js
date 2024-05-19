const {DataTypes} = require ("sequelize")
module.exports =  (sequelize) => {
    const  Project = sequelize.define("Project", {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            autoIncrement:true
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          }


          


    });
    Project.associate = (models) => {
        Project.belongsToMany(models.Department, { as: 'DepartmentProjects', through: models.DepartmentProject, foreignKey: 'ProjectId'});

      }

      return Project
}