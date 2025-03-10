const { request } = require("express");
const endpoints = require("../endpoints.json");

function getApi(req, res, next) {
        res.status(200).send({endpoints});
    };

module.exports = { getApi };