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

app.post("/users", async (req,res,next)=>{
    const {username, password, email, phonenumber } =req.body

    //console.log(req)
    await myDataSource.query(
        `INSERT INTO users(
            username,
            password,
            email,
            phonenumber
        ) VALUES(?, ?, ?, ?)`
        ,[username, password, email, phonenumber]
    )
    res.status(201).json({message : "userCreated"})
})

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async()=>{
    server.listen(PORT, ()=> console.log(`server is listening on ${PORT}`))
}

start()