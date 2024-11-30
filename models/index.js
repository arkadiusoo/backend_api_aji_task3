// importing dependencies
const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");
// creating connection with db
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});
// creating db object
const db = {};
db.Sequelize = Sequelize; // sharing Sequelize class
db.sequelize = sequelize; // sharing db conection
// importing models
db.categories = require("./category.model")(sequelize, DataTypes);
db.products = require("./product.model")(sequelize, DataTypes);
db.orders = require("./order.model")(sequelize, DataTypes);
db.statuses = require("./status.model")(sequelize, DataTypes);
db.orderProduct = require("./order_product.model")(sequelize, DataTypes);
// exporting db object
module.exports = db;
