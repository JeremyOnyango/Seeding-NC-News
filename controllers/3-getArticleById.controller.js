const { request, response } = require("express");
const fetchArticleById  = require("../models/3-fetchArticleById.model")

function getArticleById ( request, response, next){
    const {article_id} = request.params;
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article});
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = getArticleById;