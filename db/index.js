require('dotenv').config({ path: `../.env` });

const Sequelize = require("sequelize");

const DB = {};
DB.sequelize = new Sequelize(
  process.env.DATABASE_URL,{
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, 
        rejectUnauthorized: false, 
      },
    },
  }
);

DB.user = DB.sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

DB.gadgets = DB.sequelize.define("gadgets", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("Available", "Deployed", "Destroyed", "Decommissioned"),
    allowNull: false,
    defaultValue: "Available",
  },
  createdBy: {
    type: Sequelize.STRING, 
    allowNull: false,
  },
});

function getDB() {
  if (this.DB) {
    return this.DB;
  } else {
    this.DB = DB;
    return this.DB;
  }
}

module.exports = getDB;