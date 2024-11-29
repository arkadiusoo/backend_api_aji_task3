const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.categories = require("./category.model")(sequelize, DataTypes);
db.products = require("./product.model")(sequelize, DataTypes);
db.orders = require("./order.model")(sequelize, DataTypes);
db.statuses = require("./status.model")(sequelize, DataTypes);
db.orderProduct = require("./order_product.model")(sequelize, DataTypes);

module.exports = db;
