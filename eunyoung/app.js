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
    const { user_id, password, name, email, user_img } = req.body
    
    await myDataSource.query(
        `INSERT INTO users(
            user_id,
            password,
            name,
            email,
            user_img
            ) VALUES (?, ?, ?, ?, ?);
        `,
        [ user_id, password, name, email, user_img ]
    );

    res.status(201).json({ "message" : "userCreated!" });
})



const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start()