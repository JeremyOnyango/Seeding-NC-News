const { request, response } = require("express");
const fetchUsers = require("../models/9-fetchUsers.model");

function getUsers(request, response, next){
    fetchUsers()
    .then((users) => {
        response.status(200).send({users});
    })
    .catch((error) => {
        next(error);
    });
};

module.exports = getUsers