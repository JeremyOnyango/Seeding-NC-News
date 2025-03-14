const db = require("../db/connection");

function fetchArticles(sort_by = "created_at", order = "desc", filter_by, value) {
    const queryParams = [];

    const allowedSortByParams = ["created_at", "votes", "article_id", "author", "title", "topic", "comment_count"];
    
    const allowedOrders = ["asc", "desc", "ASC", "DESC"];

    if(!allowedSortByParams.includes(sort_by) || !allowedOrders.includes(order)){
        return Promise.reject({status: 400, msg: "Bad Request"})
    };

    const allowedFilters = ["topics"];
    
    if(filter_by && !allowedFilters.includes(filter_by)){
        return Promise.reject({status: 400, msg: "Bad Request"})
    };

        let queryStr = 
        `SELECT articles.*, 
        COUNT(comments.article_id)::INT 
        AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id `;
    
    if(filter_by && value){
        const topicsCheckQuery = `SELECT * FROM topics WHERE slug = $1`;

        return db.query(topicsCheckQuery, [value])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Topic Not Found" });
            }
            queryParams.push(value)
            queryStr += `WHERE articles.topic = $1 `
        })
        .then(() =>{
            queryStr += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;
            return db.query(queryStr, queryParams)
            .then(({rows}) => {
                return rows
            })
        })
    }

    queryStr += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;
    return db.query(queryStr, queryParams)
    .then(({rows}) => {
        return rows
    })
}

module.exports = fetchArticles;
