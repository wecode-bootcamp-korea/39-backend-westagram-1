const http = require("http");
const express = require("express");
const cors = require ("cors");
const morgan = require ("morgan");

const dotenv = require ("dotenv");
dotenv.config()

const { DataSource } = require('typeorm');

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
app.use(express.json()); // 외부에서 들어오는 요청 값 바디를 parsing하여 데이터 구조를 가독성 좋게 구조화시키는 것
app.use(cors());  //프론트와 백의 서버가 서로 잘 소통 될 수 있도록 도와주는 언어
// cors 메소드는 함수의 포함시켜 부분 적용 가능 
app.use(morgan('dev'));

dotenv.config();

app.get("/ping", (req,res) => {
    res.json({message : "pong"});
})

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
}

start();