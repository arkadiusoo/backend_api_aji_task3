module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "Status",
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "statuses",
      timestamps: false,
    }
  );

  return Status;
};
