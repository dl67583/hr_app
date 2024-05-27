const {DataTypes} = require ("sequelize")


module.exports = function(sequelize, DataTypes) {
    const UserRole = sequelize.define('UserRole', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        // unique: 'unique-role-per-user'
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'role',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        // unique: 'unique-role-per-user'
      },
    }, {
      timestamps: true,
      underscored: true,
      tableName: 'UserRoles'
    });
  

    UserRole.associate = (models) => {
      UserRole.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'User' });
      UserRole.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id', as: 'Role' }); 
    }

    return UserRole;
  };