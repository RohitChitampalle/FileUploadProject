const express = require("express")
const cors = require('cors');
const dotenv = require('dotenv')

const port = 8013;

//db connection 

dotenv.config();
const connection = require("./src/Models/index");

// //routes
const UserRouter = require("./src/Routes/index")
const UploadFile = require("./src/Routes/uploadFile")

const app = express()

//Middleware - Plugin
app.use(cors());




//Routes
app.use("/api/user/", UserRouter)
app.use("/api/file/", UploadFile)


app.listen(port, () => {
    console.log(`server is running on ${port}`)
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connection created with Mysql successfully");
    });
})