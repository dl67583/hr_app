module.exports = function(sequelize, DataTypes) {
   const UserRole = sequelize.define('UserRole', {
     id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       allowNull: false,
       autoIncrement: true
     },
     userId: { 
       type: DataTypes.INTEGER,
       field: 'userId', // Maps to the userId column in the database
       references: {
         model: 'Users',
         key: 'id',
       },
       onDelete: 'cascade',
       onUpdate: 'cascade',
     },
     roleId: { 
       type: DataTypes.INTEGER,
       field: 'roleId', // Maps to the roleId column in the database
       references: {
         model: 'Roles',
         key: 'id',
       },
       onDelete: 'cascade',
       onUpdate: 'cascade',
     },
   }, {
     timestamps: true,
   });
 
   UserRole.associate = (models) => {
     UserRole.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'User' });
     UserRole.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id', as: 'Role' });
   };
 
   return UserRole;
 };
 