const db = require("../../db/connection");
const { topicData, userData, articleData, commentData } = require("../data/test-data");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.findArticleId = (articleResults) => {
const articleIdObj = {};
articleResults.rows.forEach((row) => {
  articleIdObj[row.title] = row.article_id;
})
return articleIdObj;
};
