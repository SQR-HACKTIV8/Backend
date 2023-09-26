const request = require("supertest");
const app = require("../app");
const redis = require("../config/redis");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");
let access_token = "";
let dynamicOrderId;
let wrong_access_token = "wrong";

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
  await sequelize.queryInterface.bulkInsert(
    "Categories",
    [
      {
        name: "Kambing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sapi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
  await sequelize.queryInterface.bulkInsert(
    "Qurbans",
    [
      {
        name: "Kambing Boer",
        CategoryId: 1,
        price: 1500000,
        quality: "Good",
        description:
          "Kondisi sehat, tidak ada cacat, dan bulu yang sedikit kasar",
        imageUrl1:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/1/14/6171073/6171073_d75eb03a-c5cd-4e81-af69-27e820cfbb36_1354_1354.jpg",
        imageUrl2:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/1/14/6171073/6171073_fb5c19e6-dce6-487a-bb22-6fe32ae26ad9_1194_1194.jpg",
        imageUrl3:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/1/14/6171073/6171073_1f0822c8-9d98-4ff6-90d7-4926ac3b0a8b_1998_1998.jpg",
        videoUrl: "https://www.youtube.com/shorts/ukRgH2LMYjg",
        weight: "10 kg",
        isBooked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kambing Muara",
        CategoryId: 1,
        price: 1700000,
        quality: "Premium",
        description:
          "Kambing dengan kualitas premium, kesehatan terjamin, dan memiliki bulu lembut dan mengkilap.",
        imageUrl1:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2022/4/12/ac9c8ff1-a967-4610-ac2d-4ddd30560bad.jpg",
        imageUrl2:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2022/4/12/d3ab0bd5-0c2b-41a0-840a-0cadbd6cf834.jpg",
        imageUrl3:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2022/4/12/764da653-3f6e-488e-854a-254bf9229af2.jpg",
        videoUrl: "https://www.youtube.com/shorts/MnLng0Sop2M",
        weight: "12 kg",
        isBooked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kambing Samosir",
        CategoryId: 1,
        price: 1900000,
        quality: "Good",
        description:
          "Kondisi sehat dan aktif. Memiliki bulu cukup lebat dan warna yang agak gelap.",
        imageUrl1:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/6/21/6171073/6171073_fb1a5fd4-e59f-4303-823a-3ec2a0a89249_1560_1560.jpg",
        imageUrl2:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/6/21/6171073/6171073_a3cc3a21-b60e-4a39-9de3-f4dde13abbab_1271_1271.jpg",
        imageUrl3:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/6/21/6171073/6171073_6fe6f5b2-df87-46af-8842-3bc0917173f0_1319_1319.jpg",
        videoUrl: "https://www.youtube.com/shorts/hMqCQT0VpC8",
        weight: "12,5 kg",
        isBooked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sapi Pasundan",
        CategoryId: 2,
        price: 12000000,
        quality: "Good",
        description:
          "Sapi dengan kondisi sehat, tidak ada cacat, dan memiliki warna coklat. Bulu tebal dan mengkilap.",
        imageUrl1:
          "https://images.tokopedia.net/img/cache/900/product-1/2019/8/4/602556/602556_aba8d2c8-e88f-4db5-92c3-f6e73ea606b3_960_960.jpg",
        imageUrl2:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/6/14/526572627/526572627_b43d7ed7-63b0-422f-b7d5-812665c2f36f_1004_1004.jpg",
        imageUrl3:
          "https://images.tokopedia.net/img/cache/900/product-1/2020/7/12/526572627/526572627_a4da1139-a9ea-40be-b72f-98a5cfc50545_1500_1500.jpg",
        videoUrl: "https://www.youtube.com/shorts/mQtGpyLaiIQ",
        weight: "500 kg",
        isBooked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sapi Peranakan Ongole(PO)",
        CategoryId: 2,
        price: 12300000,
        quality: "Premium",
        description:
          "Sapi dengan kualitas premium, memiliki bulu lembut dan mengkilap. Sering dipilih untuk acara spesial.",
        imageUrl1:
          "https://images.tokopedia.net/img/cache/600/bjFkPX/2022/6/18/45b9b2a5-47b3-4dd6-a5db-a47cfcfbc2f0.jpg.webp?ect=4g",
        imageUrl2:
          "https://images.tokopedia.net/img/cache/600/bjFkPX/2022/6/18/4cf3db33-9b75-444b-9ffb-85f4f32a2fb6.jpg.webp?ect=4g",
        imageUrl3:
          "https://images.tokopedia.net/img/cache/600/bjFkPX/2022/6/18/f57dae65-f822-4b2b-9747-6e9a2ccf65ad.jpg.webp?ect=4g",
        videoUrl: "https://www.youtube.com/shorts/Kwt3vFe_2AI",
        weight: "530 kg",
        isBooked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sapi Pegon",
        CategoryId: 2,
        price: 12600000,
        quality: "Premium",
        description:
          "Sapi dengan kualitas premium, memiliki bulu lembut dan mengkilap. Sering dipilih untuk acara spesial.",
        imageUrl1:
          "https://down-id.img.susercontent.com/file/f4c929fd0f123180f81458a5a44a3820",
        imageUrl2:
          "https://down-id.img.susercontent.com/file/64db2cc9d34f8a74779c34d03a4be71f",
        imageUrl3:
          "https://down-id.img.susercontent.com/file/id-11134207-7qukx-li9w2byhhcpl4a",
        videoUrl: "https://www.youtube.com/shorts/oTarWJFvl-4",
        weight: "560 kg",
        isBooked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );

  const response = await request(app).post("/login").send({
    email: "user1@gmail.com",
    password: "abc123",
  });

  access_token = response.body.access_token;
});

describe("GET /categories", () => {
  it("should successfully get all categories without access token and filter", async () => {
    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("POST /categories", () => {
  it("responds with 201 when success", async () => {
    const body = {
      name: "Domba",
    };

    const response = await request(app).post("/categories").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("newCategory");
    expect(response.body.newCategory).toHaveProperty("id");
    expect(response.body.newCategory).toHaveProperty("name");
  });

  it("responds with 400 when name not submitted", async () => {
    const body = {};

    const response = await request(app).post("/categories").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when name is empty", async () => {
    const body = {
      name: "",
    };

    const response = await request(app).post("/categories").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /notifications", () => {
  it("responds with 201 when success", async () => {
    const body = {
      title: "sebuah title notifications",
      imageUrl:
        "https://tangerangkab.go.id/tangerangkab-web/images/IMG-20191121-WA0037.jpg",
      description: "sebuah description notification",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("imageUrl");
  });

  it("responds with 400 when title not submitted", async () => {
    const body = {
      imageUrl:
        "https://tangerangkab.go.id/tangerangkab-web/images/IMG-20191121-WA0037.jpg",
      description: "sebuah description notification",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when title is empty", async () => {
    const body = {
      title: "",
      imageUrl:
        "https://tangerangkab.go.id/tangerangkab-web/images/IMG-20191121-WA0037.jpg",
      description: "sebuah description notification",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when imageUrl not submitted", async () => {
    const body = {
      title: "sebuah title notifications",
      description: "sebuah description notification",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when imageUrl is empty", async () => {
    const body = {
      title: "sebuah title notifications",
      imageUrl: "",
      description: "sebuah description notification",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when description not submitted", async () => {
    const body = {
      title: "sebuah title notifications",
      imageUrl:
        "https://tangerangkab.go.id/tangerangkab-web/images/IMG-20191121-WA0037.jpg",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when description is empty", async () => {
    const body = {
      title: "sebuah title notifications",
      imageUrl:
        "https://tangerangkab.go.id/tangerangkab-web/images/IMG-20191121-WA0037.jpg",
      description: "",
    };

    const response = await request(app).post("/notifications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /qurbans", () => {
  it("should successfully get all qurbans without access token and filter", async () => {
    const response = await request(app).get("/qurbans");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should successfully get all qurbans without access token but with filter", async () => {
    const response = await request(app).get("/qurbans?filter=1");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("GET /qurbans/:id", () => {
  it("should successfully get a choosen qurban without access token and filter", async () => {
    const response = await request(app).get("/qurbans/2");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should respond with 404 when qurban not found", async () => {
    const response = await request(app).get("/qurbans/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Qurban not found!");
  });

  it("should respond with 500 when an internal server error occurs", async () => {
    // Simulate an internal server error by passing an invalid ID (e.g., a string)
    const response = await request(app).get("/qurbans/invalidId");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /notifications", () => {
  it("should successfully get all notifications with access token", async () => {
    const response = await request(app)
      .get("/notifications")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("shouldn't successfully get all notifications with wrong access token", async () => {
    const response = await request(app)
      .get("/notifications")
      .set("access_token", wrong_access_token);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /orders", () => {
  it("should successfully get all orders with access token", async () => {
    const response = await request(app)
      .get("/orders")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("shouldn't successfully get all orders with wrong access token", async () => {
    const response = await request(app)
      .get("/orders")
      .set("access_token", wrong_access_token);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /orders", () => {
  it("responds with 201 when success", async () => {
    const data = [
      {
        QurbanId: 1,
        treeType: "Pine",
        onBehalfOf: "Kel Budi",
      },
      {
        QurbanId: 3,
        treeType: "Pine",
        onBehalfOf: "Alm. Rudh bin Ridho, Alm. Sit binti Rizky",
      },
    ];
    // data is hardcoded in controller
    const response = await request(app)
      .post("/orders")
      .send({ data })
      .set("access_token", access_token);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("findNewOrder");
    expect(response.body.findNewOrder).toHaveProperty("id");
    expect(response.body.findNewOrder).toHaveProperty("OrderId");
    expect(response.body.findNewOrder).toHaveProperty("CustomerId");
    expect(response.body.findNewOrder).toHaveProperty("totalPrice");
    expect(response.body.findNewOrder).toHaveProperty("totalQuantity");
    expect(response.body.findNewOrder).toHaveProperty("createdAt");
    expect(response.body.findNewOrder).toHaveProperty("updatedAt");
  });

  it("responds with 401 when no access token provided", async () => {
    const body = [
      {
        QurbanId: 2,
        treeType: "Pine",
        onBehalfOf: "Kel Budi",
      },
    ];

    const response = await request(app).post("/orders").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when missing Qurban data", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ data: [] })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when missing tree type", async () => {
    const body = [
      {
        QurbanId: 1,
        onBehalfOf: "Kel Budi",
      },
    ];

    const response = await request(app)
      .post("/orders")
      .send({ data: body })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when missing sender's name", async () => {
    const body = [
      {
        QurbanId: 1,
        treeType: "Pine",
      },
    ];

    const response = await request(app)
      .post("/orders")
      .send({ data: body })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when data is null", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ data: null })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when data is not an array", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ data: "not an array" })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when QurbanId is missing", async () => {
    const body = [
      {
        treeType: "Pine",
        onBehalfOf: "Kel Budi",
      },
    ];

    const response = await request(app)
      .post("/orders")
      .send({ data: body })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when treeType is missing", async () => {
    const body = [
      {
        QurbanId: 1,
        onBehalfOf: "Kel Budi",
      },
    ];

    const response = await request(app)
      .post("/orders")
      .send({ data: body })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when onBehalfOf is missing", async () => {
    const body = [
      {
        QurbanId: 1,
        treeType: "Pine",
      },
    ];

    const response = await request(app)
      .post("/orders")
      .send({ data: body })
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /orders/1", () => {
  it("should successfully get all order details with access token", async () => {
    const response = await request(app)
      .get("/orders/1")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("order");
    expect(response.body).toHaveProperty("orderDetails");
    expect(response.body).toHaveProperty("orderHistories");
    expect(response.body.order).toHaveProperty("id");
    expect(response.body.order).toHaveProperty("CustomerId");
    expect(response.body.order).toHaveProperty("statusPayment");
    expect(response.body.order).toHaveProperty("totalPrice");
    expect(response.body.order).toHaveProperty("totalQuantity");
    expect(response.body.order).toHaveProperty("OrderId");
  });

  it("shouldn't successfully get all order details with wrong access token", async () => {
    const response = await request(app)
      .get("/orders/1")
      .set("access_token", wrong_access_token);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("DELETE /orders/1", () => {
  it("should successfully delete order with access token", async () => {
    const response = await request(app)
      .delete("/orders/1")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("shouldn't successfully delete order with wrong access token", async () => {
    const response = await request(app)
      .delete("/orders/1")
      .set("access_token", wrong_access_token);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("shouldn't successfully delete order without param", async () => {
    const response = await request(app)
      .delete("/orders")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Qurbans", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Customers", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Notifications", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await redis.quit();
});
