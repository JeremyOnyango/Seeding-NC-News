const { response } = require("express");
const db = require("../db/connection");

function submitCommentForArticleId(article_id, username, body){
    
    if(!username || !body){
        return Promise.reject({status: 400, msg: "Bad Request"})
    }

    if(typeof username === "number" || typeof body === "number"){
        return Promise.reject({status: 400, msg: "Bad Request"})
    }

    const usernameCheckQuery = `SELECT * FROM users WHERE username = $1`;

    return db.query(usernameCheckQuery, [username])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Username Not Found" });
        }

    const articleIdCheckQuery = `SELECT * FROM articles WHERE article_id = $1`;

    return db.query(articleIdCheckQuery, [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "ID Not Found" });
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
    })
})
}

module.exports = submitCommentForArticleId;