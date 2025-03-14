const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'
console.log(ENV)

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

const config = {};

if (ENV === "production"){
    config.connectionString = process.env.PGDATABASE_URL;
    config.max = 2;
}

const db = new Pool();

if (!process.env.PGDATABASE && !process.env.PGDATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}

module.exports = new Pool(config);