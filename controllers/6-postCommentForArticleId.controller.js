const { request, response } = require("express");
const submitCommentForArticleId = require("../models/6-submitCommentForArticleId.model");

function postCommentForArticleId(request, response, next){
    const { article_id } = request.params;
    const {username, body} = request.body;

    submitCommentForArticleId(article_id, username, body)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch((error) => {
        next(error)
    })
}


module.exports = postCommentForArticleId;