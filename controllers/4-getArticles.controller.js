const { request, response } = require("express");
const fetchArticles  = require("../models/4-fetchArticles.model")

function getArticles(request, response, next){
    const { sort_by, order, filter_by, value } = request.query;

    fetchArticles(sort_by, order, filter_by, value)
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch((error) => {
        next(error)
    })    
}

module.exports = getArticles