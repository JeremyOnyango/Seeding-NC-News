const db = require("../db/connection");

function removeCommentById(comment_id){

    const queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING*;`

    return db.query(queryStr, [comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "ID Not Found or Comment Already Deleted" });
        }
        return rows
    })
}

module.exports =  removeCommentById;