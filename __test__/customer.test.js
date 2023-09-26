const request = require("supertest");
const app = require("../app");
const redis = require("../config/redis");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert(
    "Customers",
    [
      {
        username: "user1",
        email: "user1@gmail.com",
        password: hashPassword("abc123"),
        phoneNumber: "081111111111",
        imageUrl:
          "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user2",
        email: "user2@gmail.com",
        password: hashPassword("abc123"),
        phoneNumber: "082222222222",
        imageUrl:
          "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
});

describe("POST /register", () => {
  it("responds with 201 when success", async () => {
    const body = {
      username: "usertiga",
      email: "user3@gmail.com",
      password: "abc123",
      phoneNumber: "082222222222",
      imageUrl:
        "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg",
    };

    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("email");
  });

  it("responds with 400 when email not submitted", async () => {
    const body = {
      password: "abc123",
    };

    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
    // expect(response.body).toHaveProperty('password')
  });

  it("responds with 400 when password not submitted", async () => {
    const body = {
      email: "user3@gmail.com",
    };

    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
    // expect(response.body).toHaveProperty('email')
  });

  it("responds with 400 when email is empty", async () => {
    const body = {
      email: "",
      password: "abc123",
    };

    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when password is empty", async () => {
    const body = {
      email: "user3@gmail.com",
      password: "",
    };

    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when email is already registered", async () => {
    const body = {
      email: "user3@gmail.com",
      password: "abc123",
    };

    await request(app).post("/register").send(body);

    // Jika register dengan email sama
    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when email format is invalid", async () => {
    const body = {
      email: "invalidemail",
      password: "abc123",
    };

    const response = await request(app).post("/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /login", () => {
  it("responds with 200 and access token when login success", async () => {
    const body = {
      email: "user3@gmail.com",
      password: "abc123",
    };

    const response = await request(app).post("/login").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("customer");
    expect(response.body.customer).toHaveProperty("id", 3);
    expect(response.body.customer).toHaveProperty("username", "usertiga");
    expect(response.body.customer).toHaveProperty("email", "user3@gmail.com");
  });

  it("responds with 401 when login with wrong password", async () => {
    const body = {
      email: "user3@gmail.com",
      password: "wrongpassword",
    };

    const response = await request(app).post("/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 401 when login with not-exist email", async () => {
    const body = {
      email: "notexist@gmail.com",
      password: "abc123",
    };

    const response = await request(app).post("/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when login with missing email", async () => {
    const body = {
      password: "abc123",
    };

    const response = await request(app).post("/login").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when login with missing password", async () => {
    const body = {
      email: "user3@gmail.com",
    };

    const response = await request(app).post("/login").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /customers", () => {
  it("should successfully get all customers without access token and filter", async () => {
    const response = await request(app).get("/customers");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Customers", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await redis.quit();
});
