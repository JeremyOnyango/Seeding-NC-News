const express = require("express");
const app = express();
const getApi = require("./controllers/1-getApi.controller")
const getTopics = require("./controllers/2-getTopics.controller")
const { handleServerErrors, handleCustomErrors } = require("./error.controllers")

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", (request,  response) => {response.status(404).send({msg: "path not found"})});

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = { app };
