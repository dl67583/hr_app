module.exports = (sequelize, DataTypes) => {
   const TimeAttendance = sequelize.define('TimeAttendance', {
     userId: { 
       type: DataTypes.INTEGER,
       allowNull: false,
       field: 'userId', // Map it to snake_case in the database
       references: {
         model: 'Users',
         key: 'id',
       },
       onDelete: 'CASCADE',
       onUpdate: 'CASCADE',
     },
     timeOfEntering: {
       type: DataTypes.TIME,
       allowNull: false
     },
     timeOfLeaving: {
       type: DataTypes.TIME,
       allowNull: false
     }
   });
 
   return TimeAttendance;
 };
 