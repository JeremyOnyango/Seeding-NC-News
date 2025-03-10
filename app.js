const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getApi } = require("./controllers/getApi-controller")

app.get("/api", getApi)

module.exports = { app };