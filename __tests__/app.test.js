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

      expect(article).toBeInstanceOf(Object)

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
      expect(body.msg).toBe("ID Not Found")
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
      expect(articles.length).toBe(37)

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
      expect(comments.length).toBe(9);

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

  test("GET 200: Responds with an empty array of comments for the given id", () => {
    return request(app)
    .get("/api/articles/37/comments?sort_by=created_at")
    .expect(200)
    .then(({body}) => {

      const comments = body.comments;
      expect(comments).toBeInstanceOf(Array);
      expect(comments.length).toBe(0);

    });
  });

  test("GET 404: Responds with an error message when an id does not exist", () => {
    return request(app)
    .get("/api/articles/1000/comments?sort_by=created_at")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("ID Not Found")
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
  test("GET 400: Responds with an error message when an invalid sort_by field is provided", () => {
    return request(app)
      .get("/api/articles/4/comments?sort_by=invalid_field")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
})

describe("/api/articles/:article_id/comments", () => {
  test("POST 201: Adds a comment to a given article and said comment should be returned having comment_id, votes, created_at, username, body and article_id as properties", () => {
    return request(app)
    .post("/api/articles/4/comments")
    .send({
      username: "grumpy19",
      body: "Redux can be difficult"
    })
    .expect(201)
    .then(({body}) => {
      const comment = body.comment

      expect(comment).toBeInstanceOf(Object);

        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 4,
          author: "grumpy19",
          body: "Redux can be difficult",
          votes: expect.any(Number),
          created_at: expect.any(String),
        })
    });
  });

  test("POST 201: Adds a comment to a given article and said comment should be returned having comment_id, votes, created_at, username, body and article_id as properties whilst ignoring any unnecessary properties in the body", () => {
    return request(app)
    .post("/api/articles/4/comments")
    .send({
      username: "grumpy19",
      body: "Redux can be difficult",
      title: "I hate science",
      rating: 3
    })
    .expect(201)
    .then(({body}) => {
      const comment = body.comment

      expect(comment).toBeInstanceOf(Object);

        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 4,
          author: "grumpy19",
          body: "Redux can be difficult",
          votes: expect.any(Number),
          created_at: expect.any(String),
        })
    });
  });

  test("POST 400: Responds with an error message when a body doesn't contain the right fields", () => {
    return request(app)
    .post("/api/articles/4/comments")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    });
  });

  test("POST 400: Responds with an error message when the value of a field is invalid", () => {
    return request(app)
    .post("/api/articles/4/comments")
    .send({
      username: "mronyango",
      body: 99999999999999999999999
    })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })

  test("POST 400: Responds with an error message when an id is not valid", () => {
    return request(app)
    .post("/api/articles/banana/comments")
    .send({
      username: "grumpy19",
      body: "Redux can be difficult"
    })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })

  test("POST 404: Responds with an error message when an id does not exist", () => {
    return request(app)
    .post("/api/articles/1000/comments")
    .send({
      username: "grumpy19",
      body: "Redux can be difficult"
    })
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("ID Not Found")
    });
  });

  test("POST 404: Responds with an error message when an username does not exist", () => {
    return request(app)
    .post("/api/articles/8/comments")
    .send({
      username: "MrOnyango",
      body: "Redux can be difficult"
    })
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Username Not Found")
    });
  });

})

describe("/api/articles/:article_id", () => {
  test("PATCH 200: Updates a given articles votes property and returns said article once updated", () => {
    return request(app)
    .patch("/api/articles/8")
    .send({
      inc_votes: 10
    })
    .expect(200)
    .then(({body}) => {
      const article = body.article

      expect(article).toBeInstanceOf(Object);

          expect(article).toMatchObject({
            article_id: 8, 
            author: "cooljmessy",
            title: "Express.js: A Server-Side JavaScript Framework", 
            body: "You’re probably aware that JavaScript is the programming language most often used to add interactivity to the front end of a website, but its capabilities go far beyond that—entire sites can be built on JavaScript, extending it from the front to the back end, seamlessly. Express.js and Node.js gave JavaScript newfound back-end functionality—allowing developers to build software with JavaScript on the server side for the first time. Together, they make it possible to build an entire site with JavaScript: You can develop server-side applications with Node.js and then publish those Node.js apps as websites with Express. Because Node.js itself wasn’t intended to build websites, the Express framework is able to layer in built-in structure and functions needed to actually build a site. It’s a pretty lightweight framework that’s great for giving developers extra, built-in web application features and the Express API without overriding the already robust, feature-packed Node.js platform. In short, Express and Node are changing the way developers build websites.", 
            topic: "coding", 
            created_at: "2020-10-05T22:23:00.000Z", 
            votes: 10, 
            article_img_url: "https://images.pexels.com/photos/11035482/pexels-photo-11035482.jpeg?w=700&h=700"
          })
    });
  });

  test("PATCH 400: Responds with an error message when a body doesn't contain the right fields", () => {
    return request(app)
    .patch("/api/articles/8")
    .send({})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    });
  });

  test("PATCH 400: Responds with an error message when the value of a field is invalid", () => {
    return request(app)
    .patch("/api/articles/8")
    .send({
      inc_votes: "hi"
    })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })

  test("PATCH 400: Responds with an error message when an id is not valid", () => {
    return request(app)
    .patch("/api/articles/banana")
    .send({
      inc_votes: 1
    })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })

  test("PATCH 404: Responds with an error message when an id does not exist", () => {
    return request(app)
    .patch("/api/articles/1000")
    .send({
      inc_votes: 1
    })
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("ID Not Found")
    });
  });

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: Responds with a 204 message with no content once a comment is successfully deleted", () => {
    return request(app)
    .delete("/api/comments/4")
    .expect(204)
    })
  })
  test("DELETE 400: Responds with an error message when an id is not valid", () => {
    return request(app)
    .delete("/api/comments/banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })

  test("DELETE 404: Responds with an error message when an id does not exist or the comment has already been deleted", () => {
    return request(app)
    .delete("/api/comments/1000")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("ID Not Found or Comment Already Deleted")
    });
  });
})