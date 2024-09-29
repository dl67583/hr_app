// rolePermissions.js (updated)
module.exports = (sequelize, DataTypes) => {
   const RolePermission = sequelize.define('RolePermission', {
     id: {
       type: DataTypes.INTEGER,
       allowNull: false,
       primaryKey: true,
       autoIncrement: true,
     },
     roleId: {
       type: DataTypes.INTEGER,
       references: {
         model: 'Roles',
         key: 'id',
       },
       allowNull: false,
       onDelete: 'CASCADE',
     },
     permissionType: {
       type: DataTypes.ENUM('read', 'write'),
       allowNull: false,
     },
     scope: {
       type: DataTypes.ENUM('individual', 'team', 'department', 'project'),
       allowNull: false,
     },
     resource: {
       type: DataTypes.STRING,  // 'user', 'project', etc.
       allowNull: false,
     },
     projectId: {
       type: DataTypes.INTEGER,
       references: {
         model: 'Projects',
         key: 'id',
       },
       allowNull: true,
     },
   }, { timestamps: false });
 
   RolePermission.associate = function(models) {
     RolePermission.belongsTo(models.Role, { foreignKey: 'roleId' });
     RolePermission.belongsTo(models.Project, { foreignKey: 'projectId' });
   };
 
   return RolePermission;
 };
 