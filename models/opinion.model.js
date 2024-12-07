module.exports = (sequelize, DataTypes) => {
  const Opinion = sequelize.define(
    "Opinion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "opinions",
      timestamps: false,
    }
  );

  return Opinion;
};
