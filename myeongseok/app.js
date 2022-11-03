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

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = myDataSource.query(
    `SELECT
  users.id as userID,
  users.profile_image as userProfileImage,
  posts.id as postingId,
  posts.post_image as postingImageUrl,
  posts.content as postingContent
  FROM users, posts
  WHERE users.id = ${id} and ${id} = posts.user_id`,
    (err, data) => {
      res.status(200).json({ data });
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
