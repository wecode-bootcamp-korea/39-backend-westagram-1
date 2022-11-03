// 
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
//(morgan('해당 내용에 대해 tiny로 지정 하면 '))
//로깅메세지가 나오지 않습니다.

myDataSource.initialize()
    .then(()=> {
        console.log("Data source has been inistializing")
    })
// 위에 내용은 api를 구동하기 위한 Package Module을 연결하기 위한 경로 설정을 한 것 입니다.
// express는 node.js를 구동할때 복잡한 구문을 simple하게 적용하여 보다 효율적으로 관리 할 수 있습니다.
// cors는 3세대 웹 서버로 넘어 오면서 프론트서버와 엔드 서버 같은 의사 소통을 하기 위한 api모듈로 볼수 있습니다.
// morgan은 웹 정보 로그들을 가지고 오는 기능입니다.
// dotenv는 환경 파일들을 저장한 파일 입니다.
//::ffff:127.0.0.1 - - [02/Nov/2022:10:57:18 +0000] "GET /ping HTTP/1.1" 200 18 "-" "HTTPie/3.2.1"
// 서버구동시에 나오는 위에 구문이 morgan에 관련된 내용 입니다.


// const {appendFile} = require("fs");
// const { start } = require("repl");




//health check
app.get("/ping", (req,res)=>{
    res.json({message : "pong"});
})





const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async()=>{
    server.listen(PORT, ()=> console.log(`server is listening on ${PORT}`))
}

start()

