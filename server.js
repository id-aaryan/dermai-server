/* require('./config/db')
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const Router = require('./api/User');

const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
// const bodyParser = require('express').json;
const cors = require("cors");
const bodyParser = require("body-parser");

// using the application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(bodyParser());
app.use(cors());
app.use('/', Router)

const imageModel = require("./models/Image");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage }).single("image");

app.post("/upload", upload, (req, res) => {
    const saveImage =  imageModel({
        name: req.body.name,
        img: {
            data: fs.readFileSync("uploads/" +  req.file.filename),
            contentType: "image/png",
        },
    });
    saveImage
        .save()
        .then((res) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.send(err, "FAILURE");
        });
});


app.get('/',async (req,res)=>{
  const allData = await imageModel.find();
  res.json(allData);
})

app.listen(port, () => {
    console.log("server running on port: " + port);
})
 */

require('./config/db')

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./api/User');

const bodyParser = require('express').json;
const cors = require("cors");
// using the application
app.use(bodyParser());
app.use(cors());
app.use('/', UserRouter);

app.listen(port, () => {
    console.log("server running on port: " + port);
})