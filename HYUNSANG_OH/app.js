const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { DataSource } = require("typeorm");

dotenv.config();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource
  .initialize()

  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//health check
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/allPosts", async (req, res) => {
  const posts = await appDataSource.query(
    `
    SELECT
        u.id as userId,
        u.profile_image as userProfileImage,
        p.user_id as postingId,
        p.image_url as postingImageUrl,
        p.content as postingContent
    FROM users u
    JOIN posts p ON u.id = p.user_id;
    `
  );
  res.status(200).json({ data: posts });
});

app.post("/signup", async (req, res, next) => {
  const { name, email, password, profile_image } = req.body;
  await appDataSource.query(
    `
    INSERT INTO users(
        user_name,
        email,
        user_password,
        profile_image
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, password, profile_image]
  );
  res.status(201).json({ message: "userCreated" });
});

app.post("/post", async (req, res, next) => {
  const { title, content, image_url, user_id } = req.body;
  await appDataSource.query(
    `
    INSERT INTO posts(
        title,
        content,
        image_url,
        user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, image_url, user_id]
  );
  res.status(201).json({ message: "postCreated" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
