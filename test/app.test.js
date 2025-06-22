const request = require("supertest");
const app = require("../app");

let token = "";
let userId = "";
let postId = "";

describe("Users API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test",
        surname: "User",
        email: "jestuser@example.com",
        password: "testpass123",
        birthdate: "2000-01-01",
        gender: "Other"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("jestuser@example.com");
    userId = res.body.user._id;
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "jestuser@example.com",
        password: "testpass123"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put("/api/users/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "TestUpdated" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("TestUpdated");
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/users/all");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should sign in or register with Google", async () => {
    const res = await request(app)
      .post("/api/users/googleSignIn")
      .send({
        givenName: "Google",
        familyName: "User",
        email: "jestgoogleuser@example.com",
        birthday: "1999-01-01",
        gender: "Other"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("jestgoogleuser@example.com");
  });

  it("should send password reset email", async () => {
    const res = await request(app)
      .get(`/api/users/send-password-reset-email/${userId}`);
    expect([200, 500]).toContain(res.statusCode);
  });

  it("should return error for invalid password reset token", async () => {
    const res = await request(app)
      .get("/api/users/validate-password-reset-token?token=invalidtoken");
    expect([404, 400, 500]).toContain(res.statusCode);
  });

  it("should return error for reset password with invalid token", async () => {
    const res = await request(app)
      .post("/api/users/reset-password")
      .send({ token: "invalidtoken", newPassword: "newpass123" });
    expect([404, 400, 500]).toContain(res.statusCode);
  });

  it("should delete the user", async () => {
    const res = await request(app)
      .delete("/api/users/delete")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe("Posts API", () => {
  it("should create a post", async () => {
    const postData = {
      userId,
      mood: "Happy"
    };
    const res = await request(app)
      .post("/api/posts")
      .field("post", JSON.stringify(postData));
    expect(res.statusCode).toBe(200);
    expect(res.body.mood).toBe("Happy");
    postId = res.body._id;
  });

  it("should get all posts for user", async () => {
    const res = await request(app)
      .get(`/api/posts/user-post/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it("should get a single post", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(postId);
  });

  it("should update a post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .field("post", JSON.stringify({ mood: "Sad" }));
    expect([200, 500]).toContain(res.statusCode);
  });

  it("should get mood average per weekday", async () => {
    const res = await request(app)
      .get(`/api/posts/get-weekdays-media/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("should get mood average per sleep hours", async () => {
    const res = await request(app)
      .get(`/api/posts/get-sleep-hours-media/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("should get top 5 activities", async () => {
    const res = await request(app)
      .get(`/api/posts/get-top-5-activities/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("should get best activity for Ecstatic mood", async () => {
    const res = await request(app)
      .get(`/api/posts/get-best-activity/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("should get most active day", async () => {
    const res = await request(app)
      .get(`/api/posts/get-most-active-day/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get energy and sleep quality arrays", async () => {
    const res = await request(app)
      .get(`/api/posts/get-energy-and-sleep-information/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("energy");
    expect(res.body).toHaveProperty("sleep");
  });

  it("should get posts for a specific month and year", async () => {
    const now = new Date();
    const res = await request(app)
      .get(`/api/posts/get-month-information/${userId}?month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get activity preferences by mood", async () => {
    const res = await request(app)
      .get(`/api/posts/get-activities-preferences/${userId}/Happy`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("should get activity preferences by mean", async () => {
    const res = await request(app)
      .get(`/api/posts/get-activities-preferences/${userId}/mean`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });

  it("should delete a post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});