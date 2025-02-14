module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define("UserRole", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
    roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Roles", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
  });

  UserRole.associate = (models) => {
    if (!models.User || !models.Role) {
      throw new Error("Missing required models: User or Role in UserRole associations");
    }

    UserRole.belongsTo(models.User, { foreignKey: "userId" });
    UserRole.belongsTo(models.Role, { foreignKey: "roleId" });
  };

  return UserRole;
};
