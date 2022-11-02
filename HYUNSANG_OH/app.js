const http = require("http");
const express = require("express");
const cors = require ("cors");
const morgan = require ("morgan");
const dotenv = require ("dotenv");
const { DataSource } = require('typeorm');

dotenv.config()

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
        console.log("DataSource has been initialized!")
    })

app = express()
app.use(express.json()); 
app.use(cors());   
app.use(morgan('dev'));

//health check
app.get("/ping", (req,res) => {
    res.json({message : "pong"});
})

app.post("/signup", async (req,res,next) => {
    const {name, email, password,profileImage} = req.body;
    await myDataSource.query(
        `INSERT INTO users(
            userName,
            email,
            userPassword,
            profile_image
        ) VALUES (?, ?, ?, ?);`,
        [name, email, password, profileImage]
    );
    res.status(201).json({message : "userCreated"});
})


const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
}

start();