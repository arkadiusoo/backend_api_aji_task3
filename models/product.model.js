module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      weight_unit: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "categories",
          key: "name",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "products",
      timestamps: false,
    }
  );

  return Product;
};
