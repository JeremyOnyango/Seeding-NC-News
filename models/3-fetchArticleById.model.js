const db = require("../db/connection");

function fetchArticleById(article_id){
    return db.query(
        `SELECT articles.*, 
        COUNT(comments.article_id)::INT 
        AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "ID Not Found"})
        }
        return rows[0];
    })
}

module.exports = fetchArticleById