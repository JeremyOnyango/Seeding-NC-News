const  { request } = require("express");
const endpoints = require("../endpoints.json");

function getApi(request, response, next) {
        response.status(200).send({endpoints})
        .catch((error) => {
            next(error)
        })
    };

module.exports = getApi;