const { request } = require("express");
const fetchTopics  = require("../models/2-fetchTopics.model")

function getTopics(request, response, next){
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = getTopics;