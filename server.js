require('./config/db')
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const Router = require('./api/User');

const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require('express').json;
const cors = require("cors");
const path = require('path');
// const bodyParser = require("body-parser");

// using the application
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser());
app.use(cors());
app.use('/', Router)

const Image = require("./models/Image");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname)
    }
});

const upload = multer({ storage: storage }).single("image");

app.post("/upload", upload, (req, res) => {
    const saveImage = Image({
        // name: req.body.name,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: "image/png",
        },
    });
    saveImage
        .save()
        .then((res) => {
        console.log("image is saved");
        })
        .catch((err) => {
        console.log(err, "error has occur");
        });
        res.send('image is saved')
});


app.get('/',async (req,res)=>{
  const allData = await imageModel.find()
  res.json(allData)
})

app.listen(port, () => {
    console.log("server running on port: " + port);
})
