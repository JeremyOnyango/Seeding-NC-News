const db = require("../connection");
const format = require("pg-format");
const {convertTimestampToDate, findArticleId} = require("../seeds/utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics;`)
  })
  .then(() => {
    return db.query(`CREATE TABLE topics(
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL,
      img_url VARCHAR(1000) NOT NULL 
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
    );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR REFERENCES topics (slug),
      author VARCHAR REFERENCES users (username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) NOT NULL
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles (article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users (username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`)
  })
  .then(() => {
    const formattedTopics = topicData.map((topic) => {return [topic.slug, topic.description, topic.img_url]});

    const insertTopics = format(
      `INSERT INTO topics 
      (slug, description, img_url) 
      VALUES 
      %L
      RETURNING *;`, 
      formattedTopics
    );

    return db.query(insertTopics);
  })
  .then(() => {
    const formattedUsers = userData.map((user) => {return [user.username, user.name, user.avatar_url]});

    const insertUsers = format(
      `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      %L
      RETURNING*;`,
      formattedUsers
    );

    return db.query(insertUsers);
  })
  .then(() => {

    const formattedArticles = articleData.map((article) => {

      const convertedArticle = convertTimestampToDate(article)

      return [article.title, article.topic, article.author, article.body, convertedArticle.created_at, article.votes, article.article_img_url]});

//console.log(formattedArticles)

    const insertArticles = format(
      `INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES
      %L
      RETURNING*;`,
      formattedArticles
    );

    return db.query(insertArticles);
  })
  .then((articleResults) => {

    const idLookup = findArticleId(articleResults);

    const formattedComments = commentData.map((comment) => {

      const convertedComment = convertTimestampToDate(comment)

      const articleId = idLookup[comment.article_title]

      console.log(articleId)

      return [articleId, comment.body, comment.votes, comment.author, convertedComment.created_at]
    });

    const insertComments = format(
      `INSERT INTO comments
      (article_id, body, votes, author, created_at)
      VALUES
      %L
      RETURNING*;`,
      formattedComments
    );
    
    return db.query(insertComments)
  })
};
module.exports = seed;
