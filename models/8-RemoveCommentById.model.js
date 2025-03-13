const { response } = require("express");
const db = require("../db/connection");

function removeCommentById(comment_id){

    const queryStr = `DELETE FROM comments `

    return db.query(`${queryStr} WHERE comment_id = $1 RETURNING*;`, [comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "ID Not Found or Comment Already Deleted" });
        }
        return rows
    })
}

module.exports =  removeCommentById;