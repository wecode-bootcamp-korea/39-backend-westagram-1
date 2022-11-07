const express = require ("express");

const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config()

const { DataSource } = require('typeorm')

const myDataSource = new DataSource({
    type : process.env.TYPEORM_CONNECTION,
    host : process.env.TYPEORM_HOST,
    PORT : process.env.TYPEORM_PORT,
    username : process.env.TYPEORM_USERNAME,
    password : process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
      console.error("Error during Data Source initialization", err)
  myDataSource.destroy()
  })

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// health check
app.get("/ping", (req, res) => {
    res.status(201).json({"message" : "pong"});
})

//create account
app.post("/users/signup", async (req, res, next) => {
  const {name, email, profileImage, password} = req.body
  console.log(req);

  //console.log(req)    

  await myDataSource.query(
    `INSERT INTO users(
      name, 
      email, 
      profile_image, 
      password
  ) VALUES (?, ?, ?, ?);
  `,
  [name, email, profileImage, password])

  res.status(201).json({ message : "userCreated"});
})

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start()