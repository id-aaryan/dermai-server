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
    images = "";
    quiz = -1;

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
    } 
    // else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //     res.json({
    //         status: "FAILED",
    //         message: "Invalid email"
    //     });
    // } 
    else if (! (0 < Number(dateOfBirth) < 100)) {
        res.json({
            status: "FAILED",
            message: "Invalid age"
        }); 
    } 
    // else if (password.length<8) {
    //     res.json({
    //         status: "FAILED",
    //         message: "Invalid password"
    //     });
    // }
     else {
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

router.post("/results", (req, res) => {
    let {email} = req.body;
    email = email.trim();

    User.find({email}).then(data => {
        if (data.length != 0) {
            const imageUrl = data[0].images;
            res.json({
                data: imageUrl,
                status: "SUCCESS",
                message: "Image uploaded succesfully"
            });
        } else {
            res.json({
                status: "FAILED",
                message: "Not found"
            });
        }
    }).catch(err => {

    })
})

router.post("/quizSubmit", (req, res) => {
    let { score } = req.body;
    quiz = score;
})

router.post("/quizGet", (req, res) => {
    res.json({
        quiz: quiz,
    });
})

router.post("/excema", (req, res) => {
    // strategy 0 is two white patients not both excema
    // strategy 1, 2, 3 is one white and one black both excema
    // strategy 4 is two white both excema
    var excemaExamples = new Array(
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema8_fodu2m.jpg",         
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema7_ievmxe.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema6_skfjzm.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema2_fjsrwo.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema1_gef6lh.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema3_dlf6as.jpg"
        );
    const strategy = Math.floor(Math.random() * 5);
    const quizQuestionType = Math.floor(Math.random() * 2);
    const image1 = Math.floor(Math.random() * 3);
    const image2 = (image1 + 1) % 3;
    var image1Url = "";
    var image2Url = "";
    if(strategy == 0) {
        image1Url = excemaExamples[image1];
        image2Url = excemaExamples[image2];
    } else if (strategy == 4) {
        image1Url = excemaExamples[image1];
        image2Url = excemaExamples[image2];
    } else {
        image1Url = excemaExamples[image1+3];
        image2Url = excemaExamples[image2+3];
    }
    res.json({
        image1: image1Url,
        image2: image2Url,
        quizType: quizQuestionType,
        status: "SUCCESS",
        message: "Image uploaded succesfully"
    });
})

module.exports = router;
