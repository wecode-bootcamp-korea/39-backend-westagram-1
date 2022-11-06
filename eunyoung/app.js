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
    })

const app = express()
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get("/ping", (req, res) => {
    res.status(201).json({ message : "pong" })
});

// 회원가입
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

// 게시글 등록
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

// 전체 게시글 조회
app.get("/posts/all", async (req, res, next) => {
    const postData = 
    await myDataSource.query(
        `SELECT
            users.id AS userID,
            users.userImg as userProfileImage,
            posts.userId AS postingID,
            posts.contentImg AS postingImageUrl,
            posts.content AS postingContent
        FROM
            users
        INNER JOIN
            posts ON posts.userId = users.id   
        `
    );
    res.status(200).json({ data: postData });
})

// 유저게시글 조회
app.get("/posts/:userId", async (req, res) => {
    const userId = req.params.userId;

    const userData =
    await myDataSource.query(
        `
        SELECT
            users.id AS userId,
            users.userImg AS userProfileImage
        FROM
            users
        WHERE
            users.id = ${userId}
        `
    );
    const postData =
    await myDataSource.query(
        `SELECT
            posts.id AS postingId,
            posts.contentImg AS postingImageUrl,
            posts.content AS postingContent
        FROM
            posts
        INNER JOIN
            users ON users.id = posts.userId
        WHERE
            users.id = ${userId}
        `,
    );
    userData[0].postingData = postData
    res.status(200).json({ data: userData })
})

// 게시글 수정
app.put("/posts", async (req, res) => {
    const { title, content, contentImg, id } = req.body

    await myDataSource.query(
        `UPDATE
            posts
        SET
            title = ?,
            content = ?,
            contentImg = ?
        WHERE
            id = ?
        `,
        [ title, content, contentImg, id ]
    );
    res.status(201).json({ "message" : "successfully updated!" })
})

// 게시글 삭제
app.delete("/posts/:postId", async(req, res) => {
    const { postId } = req.params;

    await myDataSource.query(
        `DELETE FROM
            posts
        WHERE
            posts.id = ${postId}
        `
    );
    res.status(201).json({ "message" : "successfully deleted!" })
})

// 좋아요 누르기
app.post("/likes", async (req, res) => {
    const { userId, postId } = req.body

    await myDataSource.query(
        `SELECT
            id,
            userId,
            postId
        FROM
            likes
        WHERE
            userId = ? and postId = ?
        `,
        [ userId, postId ]
    );
    res.status(201).json({ "message" : "likeCreated!" })
})

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start()