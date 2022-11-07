require('dotenv').config();

const http = require('http');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm');

const app = express();

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/ping', (req, res, next) => {
  res.status(200).json({ message: 'pong' });
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
  const { title, postImageUrl, content, user_id } = req.body;

  myDataSource.query(
    `INSERT INTO posts(
      title,
      post_image,
      content,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, postImageUrl, content, user_id]
  );
  res.status(201).json({ message: 'postCreated' });
});

app.get('/posts/userId/:id', async (req, res) => {
  const { id } = req.params;
  await myDataSource.query(
    `SELECT
      u.id userID,
      u.profile_image userProfileImage,
      JSON_ARRAYAGG(JSON_OBJECT(
        "postingId", p.id,
        "postingImageUrl", p.post_image,
        "postingContent", p.content
      )) postings
    FROM users u
    INNER JOIN posts p ON p.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id`,
    [id]
  );

  (err, rows) => res.status(200).json(rows);
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

app.post('/likes', async (req, res) => {
  const { user_id, post_id } = req.body;
  await myDataSource.query(
    `INSERT INTO
      likes (user_id, post_id)
    VALUES (?, ?)`,
    [user_id, post_id]
  );
  res.status(201).json({ message: 'likeCreated' });
});

app.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  await myDataSource.query(
    `
    DELETE FROM posts
    WHERE posts.id = ?`,
    [postId]
  );
  res.status(200).json({ message: 'postingDeleted' });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
};

start();
