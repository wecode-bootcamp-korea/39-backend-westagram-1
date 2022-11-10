require('dotenv').config();

const http = require('http');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

app.post('/users/signup', async (req, res, next) => {
  const { name, email, profileImage, password } = req.body;
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  if (name && email && profileImage && password) {
    await myDataSource.query(
      `INSERT INTO users(
        name,
        email,
        profile_image,
        password
      ) VALUES (?, ?, ?, ?);
      `,
      [name, email, profileImage, hashedPassword]
    );
    return res.status(201).json({ message: 'userCreated' });
  } else {
    return res.status(400).json({ message: 'input all your info' });
  }
});

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const [user] = await myDataSource.query(
    `SELECT
      id,
      email,
      password
    FROM users
    WHERE email = ?`,
    [email]
  );

  const now = new Date();
  const payLoad =
    user === undefined
      ? undefined
      : {
          iss: 'admin',
          sub: 'loginJwtToken',
          exp: now.setDate(now.getDate() + 1),
          user_id: user.id,
        };

  const secretKey = process.env.SECRET_KEY;

  if (typeof payLoad === 'undefined') {
    res.status(400).json({ message: 'Invalid Email' });
  } else {
    if (user.id) {
      const jwtToken = jwt.sign(payLoad, secretKey);
      bcrypt.compare(password, user.password).then((isSame) => {
        if (isSame) {
          res.status(200).json({ accessToken: `${jwtToken}` });
        } else {
          res.status(400).json({ message: 'Invalid Password' });
        }
      });
    }
  }
});

app.post('/posts', async (req, res, next) => {
  const { title, postImageUrl, content, userId } = req.body;
  const token = req.header('Authorization');
  const secretKey = process.env.SECRET_KEY;
  const payLoad = jwt.verify(token, secretKey);

  if (payLoad.user_id === userId) {
    await myDataSource.query(
      `INSERT INTO posts(
      title,
      post_image_url,
      content,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
      [title, postImageUrl, content, userId]
    );
    return res.status(201).json({ message: 'postCreated' });
  } else {
    return res.status(400).json({ message: 'Invalid Access Token' });
  }
});

app.get('/posts/userId/:id', async (req, res) => {
  const { id } = req.params;
  const rows = await myDataSource.query(
    `SELECT
      u.id userID,
      u.profile_image userProfileImage,
      JSON_ARRAYAGG(JSON_OBJECT(
        "postingId", p.id,
        "postingImageUrl", p.post_image_url,
        "postingContent", p.content
      )) postings
    FROM users u
    INNER JOIN posts p ON p.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id`,
    [id]
  );

  return res.status(200).json(rows);
});

app.get('/posts', (req, res, next) => {
  myDataSource.query(
    `SELECT
        users.id as userId,
        users.profile_image as userProfileImage,
        posts.id as postingId,
        posts.post_image_url as postingImageUrl,
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
  const { userId, postId } = req.body;
  await myDataSource.query(
    `INSERT INTO
      likes (user_id, post_id)
    VALUES (?, ?)`,
    [userId, postId]
  );

  return res.status(201).json({ message: 'likeCreated' });
});

app.patch('/posts', async (req, res) => {
  const { id, content, userId } = req.body;
  const result = await myDataSource.query(
    `UPDATE posts
      SET
        content = ?
      WHERE id = ? and userId = ?
      `,
    [content, id, userId]
  );
  return res.status(201).json({
    message: 'success',
    affectedRows: result.affectedRows,
  });
});

app.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  await myDataSource.query(
    `
    DELETE FROM posts
    WHERE posts.id = ?`,
    [postId]
  );

  return res.status(200).json({ message: 'postingDeleted' });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
};

start();
