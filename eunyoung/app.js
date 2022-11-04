const http = require ("http");
const express = require ("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config()

const { DataSource } = require('typeorm')

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error During Data Source Initialization", err)
    myDataSource.destroy()
    })

const app = express()
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get("/ping", (req, res) => {
    res.status(201).json({ message : "pong" })
});


app.post("/users/signup", async (req, res, next) => {
    const { password, name, email, userImg } = req.body
    
    await myDataSource.query(
        `INSERT INTO users(
            password,
            name,
            email,
            userImg
            ) VALUES (?, ?, ?, ?);
        `,
        [ password, name, email, userImg ]
    );

    res.status(201).json({ "message" : "userCreated!" });
})

app.post("/posts", async (req, res, next) => {
    const { title, content, contentImg, userId } = req.body

    await myDataSource.query(
        `INSERT INTO posts(
            title,
            content,
            contentImg,
            userId
        ) VALUES (?, ?, ?, ?);
        `,
        [ title, content, contentImg, userId ]
    );

    res.status(201).json({ "message" : "postCreated!" });
})

app.get("/posts", async (req, res, next) => {
    const postData = 
    await myDataSource.query(
        `SELECT
            users.id AS userId,
            users.userImg AS userProfileImage,
            posts.id AS postingId,
            posts.contentImg as postingImageUrl,
            posts.content AS postingContent
        FROM
            posts
        INNER JOIN
            users ON posts.userId = users.id;
        `
    );
    res.status(200).json({ data: postData });
})

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start()