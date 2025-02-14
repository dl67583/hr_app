module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define("RolePermission", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Roles", key: "id" }, onDelete: "CASCADE" },
    action: { type: DataTypes.ENUM("create", "read", "update", "delete"), allowNull: false },
    resource: { type: DataTypes.STRING, allowNull: false },
    fields: { type: DataTypes.STRING(255), allowNull: true }, // ✅ Optimized storage for indexing
    scope: { type: DataTypes.ENUM("own", "department", "all"), allowNull: false, defaultValue: "own" },
  });

  return RolePermission;
};
