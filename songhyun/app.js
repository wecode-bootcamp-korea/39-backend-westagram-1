import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("db conneted");
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.post("/join", async (req, res) => {
  const { name, password, email } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
      name,
      password,
      email
    ) VALUES (?, ?, ?);
    `,
    [name, password, email]
  );
  res.status(200).json({ message: "user created" });
});

app.post("/upload", async (req, res) => {
  const { title, content, user_id } = req.body;

  await myDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      user_id
    ) VALUES (?, ?, ?);
    `,
    [title, content, user_id]
  );
  res.status(200).json({ message: "postCreated" });
});

app.get("/post_view", async (req, res) => {
  await myDataSource.query(
    `SELECT
      posts.user_id AS userId,
      posts.id AS postingId,
      posts.imageUrl AS postingImageUrl,
      posts.content AS postingContent,
      users.userProfileImage
    FROM posts
    INNER JOIN users ON posts.user_id = users.id`,
    (err, rows) => {
      res.status(200).json({ data: rows });
    }
  );
});

app.get("/user/post_view", async (req, res) => {
  await myDataSource.query(
    `SELECT
      
    `
  );
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () =>
    console.log(`server is listening on localhost ${PORT}`)
  );
};

start();
