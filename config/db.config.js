const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "aji_task_3",
  password: "arek",
  port: 5432,
});
client.connect();
