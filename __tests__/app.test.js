const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const {app} = require("../app");
const data = require("../db/data/development-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("/api", () => {
  test("GET 200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: Responds with an array of topic objects, each of which should have a slug and description property", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      const  topics  = body.topics;
      expect(topics).toBeInstanceOf(Array)
      expect(topics.length).toBeGreaterThan(0)

      topics.forEach((topic) => {
        expect(typeof topic.slug).toBe("string")
        expect(typeof topic.description).toBe("string")
      })
    })
  })
  test("GET 404: Responds with an error message when given a non-existent endpoint", () => {
    return request(app)
    .get("/api/tocips")
    .expect(404)
    .then(({body}) => {
      console.log(body)
      expect(body.msg).toBe("path not found")
    })
  })
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Responds with an individual article. Said article should have the properties of: author, title, article_id, body, topic, created_at, votes and article_img_url", () => {
    return request(app)
    .get("/api/articles/4")
    .expect(200)
    .then(({body}) => {
      const article = body.article;
      console.log(article)
      expect(article.article_id).toBe(4);
      expect(article.author).toBe("jessjelly");
      expect(article.title).toBe("Making sense of Redux");
      expect(article.body).toBe("When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).");
      expect(article.topic).toBe("coding");
      expect(article.created_at).toBe("2020-09-11 21:12:00");
      expect(article.votes).toBe(0);
      expect(article.article_img_url).toBe("https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg?w=700&h=700");
    });
  });
  test("GET 404: Responds with an error message when an id does not exist", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("GET 400: Responds with an error message when an id is not valid", () => {
    return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({body}) => {
      console.log(body)
      expect(body.msg).toBe("Bad Request")
    })
  })
});