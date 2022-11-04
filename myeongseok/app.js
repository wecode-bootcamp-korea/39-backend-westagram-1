const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/ping', (req, res, next) => {
  res.json({ message: 'pong' });
});

app.post('/users/signup', (req, res, next) => {
  const { name, email, profile_image, password } = req.body;

  myDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profile_image, password]
  );
  res.status(201).json({ message: 'userCreated' });
});

app.post('/posts', (req, res, next) => {
  const { title, content, user_id } = req.body;

  myDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      user_id
    ) VALUES (?, ?, ?);
    `,
    [title, content, user_id]
  );
  res.status(201).json({ message: 'postCreated' });
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  // const [user] = await myDataSource.query(
  //   `SELECT
  // users.id as userID,
  // users.profile_image as userProfileImage
  // FROM users
  // WHERE users.id = ${id}`
  // );
  // const post = await myDataSource.query(
  //   `SELECT
  //   posts.id as postingId,
  //   posts.post_image as postingImageUrl,
  //   posts.content as postingContent
  //   FROM posts
  //   WHERE posts.user_id = ${id}`
  // );
  // user.posting = post;
  // const userpost = user;
  await myDataSource.query(
    // `SELECT
    //   users.id AS userID,
    //   users.profile_image AS userProfileImage,
    //   JSON_ARRAYAGG(posts.id) AS postingId,
    //   JSON_ARRAYAGG(posts.post_image) AS postingImageUrl,
    //   JSON_ARRAYAGG(posts.content) AS postingContent
    //   FROM users
    // JOIN posts ON users.id = ${id} and ${id} = posts.user_id
    // GROUP BY users.id`,
    `SELECT
      users.id AS userID, users.profile_image AS userProfileImage,
      pi.postings
    FROM users
    JOIN (
      SELECT user_id,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "postingId", posts.id,
            "postingImageUrl", posts.post_image,
            "postingContent", posts.content
          )
        ) AS postings
      FROM posts
      GROUP BY user_id
    ) pi
    ON users.id = pi.user_id
    WHERE users.id = ${id}
    GROUP BY users.id`,
    (err, rows) => {
      const result = rows.map((row) => ({
        ...row,
        postings: JSON.parse(row.postings),
      }));
      res.status(200).json(result);
    }
  );
});

app.get('/posts', (req, res, next) => {
  myDataSource.query(
    `SELECT
        users.id as userId,
        users.profile_image as userProfileImage,
        posts.id as postingId,
        posts.post_image as postingImageUrl,
        posts.content as postingContent
      FROM posts
      INNER JOIN users ON posts.user_id = users.id`,
    (err, rows) => {
      res.status(200).json({
        data: rows,
      });
    }
  );
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
};

start();
