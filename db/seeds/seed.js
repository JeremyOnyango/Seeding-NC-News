const db = require("../connection");
const format = require("pg-format");
const {convertTimestampToDate} = require("../seeds/utils")

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
      slug VARCHAR(25) PRIMARY KEY,
      description VARCHAR(100) NOT NULL,
      img_url VARCHAR(1000) NOT NULL 
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR PRIMARY KEY,
      name VARCHAR(25) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
    );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(25) NOT NULL,
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

    const formattedArticles = articleData.map((article) => {return [article.article_id, article.title, article.topic, article.author, article.body, convertTimestampToDate(article.created_at), article.votes, article.article_img_url]});

    console.log(formattedArticles)

    const insertArticles = format(
      `INSERT INTO articles
      (article_id, title, topic, author, body, created_at, votes, article_img_url)
      VALUES
      %L
      RETURNING*;`,
      formattedArticles
    );

    return db.query(insertArticles);
  })
};
module.exports = seed;
