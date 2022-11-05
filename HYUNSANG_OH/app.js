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

//전체게시물 조회
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

//특정 유저가 쓴 게시글 조회
app.get("/userPost/:userId", async (req, res) => {
  const { userId } = req.params;
  const userPost = await appDataSource.query(
    `
    SELECT 
      users.id,
      users.profile_image,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "postingId",posts.id,
            "postingImageUrl", posts.image_url,
            "postingContent",posts.content
          )
        ) as postings
    FROM users
    LEFT JOIN posts ON users.id = posts.user_id
    WHERE users.id = ?
    GROUP BY users.id;
    `,
    [userId]
  );
  res.status(200).json({ data: userPost });
});

//회원가입
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

//게시글 작성
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

//좋아요 누르기
app.post("/likes", async (req, res, next) => {
  const { userId, postId } = req.body;

  const likes = await appDataSource.query(
    `
    SELECT EXISTS
    (SELECT * FROM likes
    WHERE user_id = ? and post_id = ?)
    AS 'LIKED';
    `,
    [userId, postId]
  );
  if (likes[0].LIKED == 0) {
    await appDataSource.query(
      `
        INSERT INTO likes(
          user_id,
          post_id
        ) VALUES (?,?);
        `,
      [userId, postId]
    );
    res.status(202).json({ message: "likeCreated" });
  } else {
    await appDataSource.query(
      `
        DELETE
        FROM likes
        WHERE user_id = ? and post_id = ?
      `,
      [userId, postId]
    );
    res.status(202).json({ message: "likesDeleted" });
  }
});

//게시글 수정
app.patch("/update/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, image_url } = req.body;
  const checkExisted = await appDataSource.query(
    `
      SELECT EXISTS
      (SELECT * FROM posts
      WHERE id = ?)
      AS postExist
      `,
    [postId]
  );
  if (checkExisted[0].postExist == 1) {
    await appDataSource.query(
      `
        UPDATE posts SET
          title = ?,
          content = ?,
          image_url = ?
        WHERE posts.id = ?
        `,
      [title, content, image_url, postId]
    );
  } else {
    res.status(404).json({ message: "Non Existing Post" });
  }
  const editedPost = await appDataSource.query(
    `
      SELECT
        users.id as userId,
        users.user_name as userName,
        posts.id as postingId,
        posts.title as postingTitle,
        posts.content as postingContent
      FROM users
      JOIN posts ON users.id = posts.user_id
      WHERE posts.id = ?
      `,
    [postId]
  );
  res.status(202).json({ data: editedPost });
});
//게시글 삭제
app.delete("/delete/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const { postId } = req.body;
  const checkExisted = await appDataSource.query(
    `
      SELECT EXISTS
      (SELECT * FROM posts
      WHERE id = ?)
      AS postExist
      `,
    [postId]
  );
  if (checkExisted[0].postExist == 1) {
    await appDataSource.query(
      `
        DELETE
        FROM posts
        WHERE posts.user_id = ? and posts.id = ?
      `,
      [userId, postId]
    );
    res.status(202).json({ message: "postingDeleted" });
  } else {
    res.status(404).json({ message: "Non Existing Post" });
  }
});
const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
