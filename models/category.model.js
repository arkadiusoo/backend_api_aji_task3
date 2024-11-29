module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      // name column
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "categories", // table name in db
      timestamps: false,
    }
  );
  return Category;
};
