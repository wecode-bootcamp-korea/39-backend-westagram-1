import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const makeHash = async (unHashedPassword, saltRounds) => {
    return await bcrypt.hash(unHashedPassword, saltRounds);
  };

  const hash = await makeHash(password, 5);
  await myDataSource.query(
    `INSERT INTO users(
      name,
      password,
      email
    ) VALUES (?, ?, ?);
    `,
    [name, hash, email]
  );
  res.status(201).json({ message: "user created" });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const hashedPassword = await myDataSource.query(
    `SELECT 
      users.password,
      users.id
    FROM users
    WHERE users.name="${name}";
    `
  );
  const dbPassword = hashedPassword[0].password;
  const userId = hashedPassword[0].id;
  const check = await bcrypt.compare(password, dbPassword);
  if (!check) {
    res.json({ message: "Invalid User" });
  }

  const send = { userId: userId };
  const jwtToken = jwt.sign(send, process.env.secretKey);
  res.json({ accessToken: jwtToken });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () =>
    console.log(`server is listening on localhost ${PORT}`)
  );
};

start();
