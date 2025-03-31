const express = require("express");
const app = express();
const cors = require("cors")

const getApi = require("./controllers/1-getApi.controller");
const getTopics = require("./controllers/2-getTopics.controller");
const getArticleById = require("./controllers/3-getArticleById.controller");
const getArticles = require("./controllers/4-getArticles.controller")
const getCommentsByArticleId = require("./controllers/5-getCommentsByArticleId.controller")
const postCommentForArticleId = require("./controllers/6-postCommentForArticleId.controller")
const patchArticleVotesById = require("./controllers/7-patchArticleVotesById.controller")
const deleteCommentById = require("./controllers/8-deleteCommentById.controller")
const getUsers = require("./controllers/9-getUsers.controller")

const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("./controllers/error.controllers");

app.use(cors())

app.use(express.json())

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentForArticleId)

app.patch("/api/articles/:article_id", patchArticleVotesById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)

app.all("*", (request,  response) => {response.status(404).send({msg: "path not found"})});

app.use(handleCustomErrors);
app.use(handlePsqlErrors)
app.use(handleServerErrors);

module.exports = { app };
