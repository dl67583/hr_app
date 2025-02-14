module.exports = (sequelize, DataTypes) => {
  const EntityRoleAssignment = sequelize.define("EntityRoleAssignment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
    entityId: { type: DataTypes.INTEGER, allowNull: false },
    entityType: { type: DataTypes.ENUM("department"), allowNull: false }, // ✅ Removed "project"
    roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Roles", key: "id" }, onDelete: "CASCADE" },
  });

  EntityRoleAssignment.associate = (models) => {
    if (!models.User || !models.Role || !models.Department) {
      console.error("❌ Missing models:", {
        User: !!models.User,
        Role: !!models.Role,
        Department: !!models.Department,
      });
      throw new Error("Model dependencies are missing in EntityRoleAssignment associations");
    }

    EntityRoleAssignment.belongsTo(models.User, { foreignKey: "userId" });
    EntityRoleAssignment.belongsTo(models.Role, { foreignKey: "roleId" });
    EntityRoleAssignment.belongsTo(models.Department, { foreignKey: "entityId", constraints: false, scope: { entityType: "department" } });
  };

  return EntityRoleAssignment;
};
