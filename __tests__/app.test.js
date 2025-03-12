const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const {app} = require("../app");
const data = require("../db/data/development-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const  toBeSorted  = require("jest-sorted")

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
      expect(topics.length).toBe(3)

      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })

      })
    })
  })
});

describe ("/api/tocips", () => {
test("GET 404: Responds with an error message when given a non-existent endpoint", () => {
    return request(app)
    .get("/api/tocips")
    .expect(404)
    .then(({body}) => {
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

      expect(article).toMatchObject({
        article_id: 4, 
        author: "jessjelly", 
        title: "Making sense of Redux", 
        body: "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).", 
        topic: "coding", 
        created_at: "2020-09-11T20:12:00.000Z", 
        votes: 0, 
        article_img_url: "https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg?w=700&h=700"})
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
      expect(body.msg).toBe("Bad Request")
    })
  })
});

describe("/api/articles?sort_by=created_at", () => {
  test("GET 200: Responds with an array of article objects, each of which should have author, title, article_id, topic, created_at, votes, article_img_url and comment_count properties. Said array should be ordered by date in descending order", () => {
    return request(app)
    .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({ body }) => {
      const articles = body.articles;
      expect(articles).toBeInstanceOf(Array)
      expect(articles.length).toBeGreaterThan(0)

      articles.forEach((article) => {  
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })

      expect(articles).toBeSorted("created_at", {descending: true})

    })
  })

  test("GET 404: Responds with an error message when given a non-existent endpoint", () => {
    return request(app)
    .get("/api/articlse?sort_by=created_at")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("path not found")
    })
  })
});

describe("/api/articles/:article_id/comments?sort_by=created_at", () => {
  test("GET 200: Responds with an array of comments for the given id with each comment having comment_id, votes, created_at, author, body and article_id properties", () => {
    return request(app)
    .get("/api/articles/4/comments?sort_by=created_at")
    .expect(200)
    .then(({body}) => {

      const comments = body.comments;
      expect(comments).toBeInstanceOf(Array);
      expect(comments.length).toBeGreaterThan(0);

      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        })
      })

      expect(comments).toBeSorted("created_at", {descending: true})
    });
  });

  test("GET 404: Responds with an error message when an id does not exist", () => {
    return request(app)
    .get("/api/articles/1000/comments?sort_by=created_at")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    });
  });

  test("GET 400: Responds with an error message when an id is not valid", () => {
    return request(app)
    .get("/api/articles/banana/comments?sort_by=created_at")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
})