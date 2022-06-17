const express = require('express');
const router = express.Router();

const User = require('./../models/User');

const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path')


router.post("/signup", (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();
    images = "" 

    if (name == "" || email== "" || password== ""|| dateOfBirth== "") {
        res.json({
            status: "FAILED",
            message: "Empty input field"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email"
        });
    } else if (! (0 < Number(dateOfBirth) < 100)) {
        res.json({
            status: "FAILED",
            message: "Invalid age"
        }); 
    } else if (password.length<8) {
        res.json({
            status: "FAILED",
            message: "Invalid password"
        });
    } else {
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "Already exists"
                }); 
            } else {
                // create new user
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name, 
                        email, 
                        password: hashedPassword,
                        dateOfBirth,
                        images
                    });
                    newUser.save()
                    .then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "sign up successful",
                            data: result,
                        }); 
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "Error occured while saving user account"
                        })
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "Error occured while hashing password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error occured while checking for existing user"
            })
        })
    }
})

router.post("/signin", (req, res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Cannot have empty field"
        })
    } else {
        User.find({email}).then(data => {
            if (data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Sign in successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Incorrect Password Entered"
                        })
                    }
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error while comparing passwords"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error while finding user"
            })
        })
    }

})

router.post("/upload", (req, res) => {
    let {email, images} = req.body;
    email = email.trim();
    images = images;
    
    if (email == "" || images == "") {
        res.json({
            status: "FAILED",
            message: "Cannot have empty field"
        })
    } else {
        User.updateOne({email}, { $set: { "images" : images } })
        .then(() => {
            res.json({
                status: "SUCCESS",
                message: "Updated Successfully"
            })
        })
        .catch(err =>{
            res.json({
                status: "FAILED",
                message: "Error while finding user"
            })
        })
    }

})

router.get("/results", (req, res) => {
    let {email} = req.body;
    email = email.trim();

    User.find({email}).then(data => {
        if (data.length != 0) {
            const imageUrl = data[0].images;
            res.send(imageUrl);
        } else {
            res.send("not working")
        }
    }).catch(err => {

    })
})

module.exports = router;
