const request = require("supertest");
const express = require("express");
const { login } = require("./auth");
const mongoose = require("mongoose");
require("dotenv").config();

const { DB_HOST } = process.env;

const app = express();
let connection;
app.use(express.json());
app.post("/users/login", login);

describe("test login controller", () => {
  console.log(process.env.DB_HOST);
  beforeAll(() =>
    mongoose.connect(process.env.DB_HOST).then(() => {
      connection = app.listen(3000);
    })
  );
  afterAll(() =>
    mongoose.disconnect().then(() => {
      connection.close();
    })
  );
  test("POST login", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({ password: "horseclimb", email: "hohosmile@gmail.com" });
    expect(response.status).toBe(201);
    expect(typeof response.body.token).toBe("string");
    const isObject = typeof response.body.user === "object";
    const isValidLength = Object.keys(response.body.user).length === 2;
    const values = Object.values(response.body.user);
    const isString =
      typeof values[0] === "string" && typeof values[1] === "string";
    expect(isObject && isValidLength && isString).toBe(true);
  });
});
