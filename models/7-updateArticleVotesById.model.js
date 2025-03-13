const { response } = require("express");
const db = require("../db/connection");

function updateArticleVotesByID(article_id, inc_votes){
    if(!inc_votes || typeof inc_votes !== "number"){
        return Promise.reject({status: 400, msg: "Bad Request"})
    }

    const queryStr = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`

    return db.query(queryStr, [inc_votes, article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "ID Not Found"})
        }
        return rows[0]
    })
};

module.exports = updateArticleVotesByID;