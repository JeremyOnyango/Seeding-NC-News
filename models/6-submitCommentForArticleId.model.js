const { response } = require("express");
const db = require("../db/connection");

function submitCommentForArticleId(article_id, username, body){
        
    if(!username|| !body){
        return Promise.reject({status: 400, msg: "Bad Request"})
    }

    if(typeof username === "number" ||typeof body === "number"){
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    
    const queryStr = 
    `INSERT INTO comments
        (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;`
        
        return db.query(queryStr, [article_id, username, body])
        .then(({rows}) => {
            return rows[0];
        })
}

module.exports = submitCommentForArticleId;