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
})
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