const { request } = require("express")
const fetchCommentsByArticleId = require("../models/5-fetchCommentsByArticleId.model.js")

function getCommentsByArticleId(request, response, next){
    const { sort_by } = request.query

    const { article_id } = request.params

    fetchCommentsByArticleId(sort_by, article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = getCommentsByArticleId