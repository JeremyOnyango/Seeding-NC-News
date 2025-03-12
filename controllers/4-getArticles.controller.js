const { request, response } = require("express");
const fetchArticles  = require("../models/4-fetchArticles.model")

function getArticles(request, response, next){
    const { sort_by } = request.query;

    fetchArticles(sort_by)
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = getArticles