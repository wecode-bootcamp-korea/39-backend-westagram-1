const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// TypeORM-DB연결
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
}); // promise 객체 사용

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// heatlh check
app.get('/ping', (req, res, next) => {
  res.json({ message: 'pong' });
});

// 서버 연결
const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
};

start();
