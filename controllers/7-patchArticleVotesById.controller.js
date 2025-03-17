const { request, response } = require("express");
const updateArticleVotesByID = require("../models/7-updateArticleVotesById.model");

function patchArticleVotesById(request, response, next){
    const { article_id } = request.params;
    const { inc_votes } = request.body;

    updateArticleVotesByID(article_id, inc_votes)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((error) => {
        next(error)
    })
};

module.exports= patchArticleVotesById;