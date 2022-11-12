const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config()

const {DataSource} = require('typeorm');
const { title } = require("process");

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE

})
app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

myDataSource.initialize()
    .then(()=> {
        console.log("Data source has been inistializing")
    })

app.get("/ping", (req,res)=>{
    res.json({message : "pong"});
})

app.post("/users/signup", async (req,res,next)=>{
    const {username, userProfileImage } =req.body

    await myDataSource.query(
        `INSERT INTO users(
            username,
            userProfileImage
        ) VALUES(?, ?)`
        ,[username, userProfileImage]
    )
    res.status(201).json({message : "userCreated"})
})

app.post("/posts", async (req,res,next)=>{
    const {postingId, Image_Url, Content} =req.body

    await myDataSource.query(
        `INSERT INTO posts(
            postingId,
            Image_Url,
            Content
        ) VALUES(?, ?, ?)`
        ,[postingId, Image_Url, Content]
    )
    res.status(201).json({message : "postCreated"})
})

app.get ('/posts',async (req,res)=>{
    await myDataSource.manager.query(    
    `SELECT
        users.id as userId,
        users.userProfileImage,
        posts.postingId,
        posts.Image_Url,
        posts.Content
        FROM users
        LEFT JOIN posts ON users.id=postingId
`
        ,(err, rows)=>{
            res.status(200).json({data:rows});
        }
    )
})

app.get ('/users/:userId/posts',async (req,res)=>{
    const {userId} = req.params
    await myDataSource.manager.query(    
    `SELECT
        users.id as userId, users.userProfileImage,
        pi.postings
        FROM users
        LEFT JOIN(
            SELECT
            userId,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "postingId", postingId,
                    "postingImageUrl", Image_Url,
                    "postingContent", Content
                )
            )as postings
            FROM posts
            GROUP BY userId 
        ) pi ON users.id = pi.userId
        WHERE users.id = ${userId};
        `
        ,(err, rows)=>{
            res.status(200).json({data:rows});
        }
    )
})

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async()=>{
    server.listen(PORT, ()=> console.log(`server is listening on ${PORT}`))
}

start()