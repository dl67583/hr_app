module.exports = (sequelize, DataTypes) => {
   const ProjectRoleAssignment = sequelize.define('ProjectRoleAssignment', {
     id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true,
     },
     userId: {
       type: DataTypes.INTEGER,
       allowNull: false,
       references: {
         model: 'Users',
         key: 'id',
       },
       onDelete: 'CASCADE',
     },
     projectId: {
       type: DataTypes.INTEGER,
       allowNull: false,
       references: {
         model: 'Projects',
         key: 'id',
       },
       onDelete: 'CASCADE',
     },
     roleId: {
       type: DataTypes.INTEGER,
       allowNull: false,
       references: {
         model: 'Roles',
         key: 'id',
       },
       onDelete: 'CASCADE',
     },
   }, {
     timestamps: false,
   });
 
   ProjectRoleAssignment.associate = function(models) {
     ProjectRoleAssignment.belongsTo(models.User, { foreignKey: 'userId' });
     ProjectRoleAssignment.belongsTo(models.Project, { foreignKey: 'projectId' });
     ProjectRoleAssignment.belongsTo(models.Role, { foreignKey: 'roleId' });
   };
 
   return ProjectRoleAssignment;
 };
 