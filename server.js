require('./config/db')
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const Router = require('./api/User');

const bodyParser = require('express').json;
const cors = require("cors");

// using the application
app.use(bodyParser());
app.use(cors());
app.use('/', Router)

app.listen(port, () => {
    console.log("server running on port: " + port);
})
