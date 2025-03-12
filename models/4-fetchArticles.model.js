const db = require("../db/connection");
const format = require("pg-format");

function fetchArticles(sort_by) {
    const allowedParams = ["created_at"];
    const queryParams = [];

    let queryStr = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ';

    if(!allowedParams.includes(sort_by)){
        return Promise.reject({status: 404, msg: "Invalid Input"})
    };

        queryParams.push(sort_by);
        queryStr += format('ORDER BY articles.%I DESC', queryParams)

        
        return db.query(queryStr).then (({rows}) => {
        return rows
        })
}


module.exports = fetchArticles
