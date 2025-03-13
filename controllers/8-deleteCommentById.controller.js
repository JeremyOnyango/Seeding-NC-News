const { request, response } = require("express");
const removeCommentById = require("../models/8-RemoveCommentById.model");

function deleteCommentById(request, response, next){
    const { comment_id } = request.params;
    
    removeCommentById(comment_id)
    .then(() => {
        response.status(204).send({})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = deleteCommentById;