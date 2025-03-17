const db = require("../db/connection");
const format = require("pg-format");

function fetchCommentsByArticleId(sort_by, article_id){
    const allowedParams = ["created_at"];
    const queryParams = [];

    const articleIdCheckQuery = `SELECT * FROM articles WHERE article_id = $1`;

    return db.query(articleIdCheckQuery, [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "ID Not Found" });
        }

        if(!allowedParams.includes(sort_by)){
            return Promise.reject({status: 400, msg: "Bad Request"})
        }
        
    let queryStr = `SELECT * FROM comments WHERE article_id = $1`;


        queryParams.push(sort_by);
        queryStr += format(` ORDER BY comments.%I DESC`, queryParams);
    


    return db.query(queryStr, [article_id])
    .then(({rows}) => {
        return rows;
    })
})
}

module.exports = fetchCommentsByArticleId