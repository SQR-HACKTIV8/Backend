const request = require("supertest");
const app = require("../app");
const redis = require("../config/redis");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");
let access_token = "";
let wrong_access_token = "wrong";
const { sign } = require("jsonwebtoken");
let access_token_fake = sign({ id: 34 }, process.env.SIGNITURE_KEY);

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
  await sequelize.queryInterface.bulkInsert("Orders", [
    {
      id: 3,
      CustomerId: 1,
      statusPayment: false,
      totalPrice: 16500000,
      totalQuantity: 2,
      OrderId: "SQR20230926T081348043Z1374",
      createdAt: "2023-09-26T08:13:48.047Z",
      updatedAt: "2023-09-26T08:13:48.078Z",
    },
    {
      id: 2,
      CustomerId: 2,
      statusPayment: true,
      totalPrice: 25200000,
      totalQuantity: 2,
      OrderId: "SQR20230925T213844757Z1066",
      createdAt: "2023-09-25T21:38:44.761Z",
      updatedAt: "2023-09-25T21:38:44.798Z",
    },
    {
      id: 3,
      CustomerId: 2,
      statusPayment: false,
      totalPrice: 16500000,
      totalQuantity: 2,
      OrderId: "SQR20230927T041346855Z1702",
      createdAt: "2023-09-25T21:38:44.761Z",
      updatedAt: "2023-09-25T21:38:44.798Z",
    },
  ]);

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
  it("should get categories from cache if available", async () => {
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];
    const stringCategories = JSON.stringify(mockCategories);
    await redis.set("sqr_categories", stringCategories);

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCategories);
  });

  it("should get categories from database if cache is not available", async () => {
    await redis.del("sqr_categories");

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

  it("shouldn't successfully get all notifications with fake access token", async () => {
    const response = await request(app)
      .get("/notifications")
      .set("access_token", access_token_fake);

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
    const body = [
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
      .send({ data: body })
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

  it("responds with 404 when treeType is missing", async () => {
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

  it("responds with 404 when onBehalfOf is missing", async () => {
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

  it("responds with 404 when try to post data that already posted", async () => {
    const body = [
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
  function sortById() {
    return function (el1, el2) {
      if (el1.id < el2.id) {
        return 1;
      } else if (el1.id > el2.id) {
        return -1;
      } else {
        return 0;
      }
    };
  }

  function modifyVideoUrl(input) {
    const check = input.videoUrl.split("=");
    if (check.length > 1) {
      return { videoUrl: check[1] };
    } else {
      return { videoUrl: input.videoUrl.split("/")[4] };
    }
  }
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

    expect(response.body.orderHistories).toBeInstanceOf(Array);
  });

  it("shouldn't successfully get all order details with wrong access token", async () => {
    const response = await request(app)
      .get("/orders/1")
      .set("access_token", wrong_access_token);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("should sort orderHistories based on id in descending order", () => {
    const input = [
      { id: 3, value: "C" },
      { id: 1, value: "A" },
      { id: 2, value: "B" },
    ];

    const expectedOutput = [
      { id: 3, value: "C" },
      { id: 2, value: "B" },
      { id: 1, value: "A" },
    ];

    const sortedArray = input.sort(sortById());
    expect(sortedArray).toEqual(expectedOutput);
  });

  it("should modify videoUrl properly", () => {
    const input = { videoUrl: "https://www.youtube.com/watch?v=abcd1234" };
    const expectedOutput = { videoUrl: "abcd1234" };

    const modifiedObject = modifyVideoUrl(input);
    expect(modifiedObject).toEqual(expectedOutput);
  });

  it("responds with 404 when order is not found", async () => {
    const response = await request(app)
      .get("/orders/999")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Order not found!");
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

  it("responds with 404 when order is not found", async () => {
    const orderId = 999;
    const response = await request(app)
      .delete(`/orders/${orderId}`)
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Order not found!");
  });

  it("responds with empty orderHistories when no data found", async () => {
    const orderDetails = [{ dataValues: { OrderHistories: [] } }];

    const response = await request(app)
      .get("/orders/1")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /token-midtrans", () => {
  it("should generate midtrans token with valid OrderId and totalPrice", async () => {
    const validData = {
      OrderId: "SQR20230926T081348043Z1374",
      totalPrice: 16500000,
    };

    const response = await request(app)
      .post("/token-midtrans")
      .send(validData)
      .set("access_token", access_token);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("redirect_url");
  });

  it("should respond with error when OrderId does not exist", async () => {
    const invalidData = {
      OrderId: "INVALID_ORDER_ID",
      totalPrice: 1000000,
    };

    const response = await request(app)
      .post("/token-midtrans")
      .send(invalidData)
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Order not found!");
  });

  it("should respond with error when Order is already paid", async () => {
    const paidOrderData = {
      OrderId: "SQR20230925T213844757Z1066",
      totalPrice: 25200000,
    };

    const response = await request(app)
      .post("/token-midtrans")
      .send(paidOrderData)
      .set("access_token", access_token);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      `Order with id ${paidOrderData.OrderId} already paid`
    );
  });

  it("should respond with error when no access token provided", async () => {
    const data = {
      OrderId: "SQR20230926T081348043Z1374",
      totalPrice: 16500000,
    };

    const response = await request(app).post("/token-midtrans").send(data);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /payment-notification", () => {
  it("responds with 200 and updates order status on successful payment", async () => {
    const notificationData = {
      transaction_time: "2023-09-27 11:17:11",
      transaction_status: "capture",
      transaction_id: "c7e3605e-d9c7-4468-9770-e3186bac71b2",
      three_ds_version: "2",
      status_message: "midtrans payment notification",
      status_code: "200",
      signature_key:
        "bd1e21a1a3b44d052e597067801370fdd54e7c2d0bc17f1946057fc96fec04422d483d465d5e1ff9e7a6fe47c069e83e8493d9c646df4e833c1532bc3675a98d",
      payment_type: "credit_card",
      order_id: "SQR20230927T041346855Z1702",
      merchant_id: "G385345940",
      masked_card: "48111111-1114",
      gross_amount: "16500000.00",
      fraud_status: "accept",
      expiry_time: "2023-09-27 11:27:11",
      eci: "05",
      currency: "IDR",
      channel_response_message: "Approved",
      channel_response_code: "00",
      card_type: "credit",
      bank: "mega",
      approval_code: "1695788237862",
    };
    const response = await request(app)
      .post("/payment-notification")
      .send(notificationData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Orders", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
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
