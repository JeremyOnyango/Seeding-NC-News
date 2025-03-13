const express = require("express");
const db = require("../db/connection");

function fetchUsers() {
    const queryStr = 'SELECT * FROM users';

    return db.query(queryStr)
    .then(({rows}) => {
        return rows;
    });
};

module.exports = fetchUsers