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
    quiz = "-1";
    diagnosis = "";
    correct = false;
    confirmed = false;

    if (name == "" || email == "" || password == ""|| dateOfBirth == "") {
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
                        images,
                        diagnosis, 
                        quiz, 
                        correct,
                        confirmed
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

router.post("/opinionCollect", (req, res) => {
    let {email, diagnosis} = req.body;
    email = email.trim();
    diagnosis = diagnosis;
    
    if (email == "" || diagnosis == "") {
        res.json({
            status: "FAILED",
            message: "Cannot have empty field"
        })
    } else {
        User.updateOne({email}, { $set: { "diagnosis" : diagnosis } })
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

router.post("/opinionShow", (req, res) => {
    let {email} = req.body;
    email = email.trim();

    User.find({email}).then(data => {
        if (data.length != 0) {
            const diagnosis = data[0].diagnosis;
            res.json({
                data: diagnosis,
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

router.post("/doctorDiagnosis", (req, res) => {
    let {email, correct} = req.body;
    email = email.trim();
    correct = correct;
    
    if (email == "") {
        res.json({
            status: "FAILED",
            message: "Cannot have empty field"
        })
    } else {
        User.updateOne({email}, { $set: { "correct" : correct } })
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

router.post("/getDoctorDiagnosis", (req, res) => {
    let {email} = req.body;
    email = email.trim();

    User.find({email}).then(data => {
        if (data.length != 0) {
            const correct = data[0].correct;
            res.json({
                data: correct,
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

router.post("/diagnosisConfirmed", (req, res) => {
    let {email, confirmed} = req.body;
    email = email.trim();
    confirmed = confirmed;
    
    if (email == "") {
        res.json({
            status: "FAILED",
            message: "Cannot have empty field"
        })
    } else {
        User.updateOne({email}, { $set: { "confirmed" : confirmed } })
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

router.post("/getConfirmation", (req, res) => {
    let {email} = req.body;
    email = email.trim();

    User.find({email}).then(data => {
        if (data.length != 0) {
            const confirmed = data[0].confirmed;
            res.json({
                data: confirmed,
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

router.post("/excema", (req, res) => {
    // strategy 0 is two white patients not both excema
    // strategy 1, 2, 3 is one white and one black both excema
    // strategy 4 is two white both excema
    var excema = new Array(
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema8_fodu2m.jpg",         
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema7_ievmxe.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema6_skfjzm.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema2_fjsrwo.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema1_gef6lh.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655732988/excema/excema3_dlf6as.jpg"
     );
    var keloids = new Array(
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913344/keloids/Screen_Shot_2021-03-03_at_11.43.49_PM_fnry1r.jpg",         
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913344/keloids/Screen_Shot_2021-03-03_at_10.37.55_PM_vbnyb2.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913344/keloids/Screen_Shot_2021-03-03_at_10.40.29_PM_ayd6mj.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913344/keloids/Screen_Shot_2021-03-03_at_9.04.19_PM_unyolv.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913345/keloids/Screen_Shot_2021-03-03_at_9.01.32_PM_iube5r.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913345/keloids/Screen_Shot_2021-03-03_at_9.02.20_PM_izm4hy.jpg"
    );
    var psoriasis = new Array(
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913724/psoriases/promo-13_otkueu.jpg",         
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913723/psoriases/7_qvleab.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913723/psoriases/4_as5ocd.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913723/psoriases/2_wbwftr.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913723/psoriases/1_zhyymm.jpg",
        "https://res.cloudinary.com/dveg6urfn/image/upload/v1655913723/psoriases/images_veyf43.jpg"
    );
    const strategy = Math.floor(Math.random() * 5);
    const conditionType = Math.floor(Math.random() * 3);
    const quizQuestionType = Math.floor(Math.random() * 2);
    const image1 = Math.floor(Math.random() * 3);
    const image2 = (image1 + 1) % 3;
    var image1Url = "";
    var image2Url = "";
    if (conditionType == 0) {
        if(strategy == 0) {
            image1Url = excema[image1];
            image2Url = excema[image2];
        } else if (strategy == 4) {
            image1Url = excema[image1];
            image2Url = excema[image2];
        } else {
            image1Url = excema[image1+3];
            image2Url = excema[image2+3];
        }
    } else if (conditionType == 1) {
        if(strategy == 0) {
            image1Url = psoriasis[image1];
            image2Url = psoriasis[image2];
        } else if (strategy == 4) {
            image1Url = psoriasis[image1];
            image2Url = psoriasis[image2+3];
        } else {
            image1Url = psoriasis[image1+3];
            image2Url = psoriasis[image2+3];
        }
    } else if (conditionType == 2) {
        if(strategy == 0) {
            image1Url = keloids[image1];
            image2Url = keloids[image2];
        } else if (strategy == 4) {
            image1Url = keloids[image1];
            image2Url = keloids[image2];
        } else {
            image1Url = keloids[image1+3];
            image2Url = keloids[image2+3];
        }
    }

    res.json({
        image1: image1Url,
        image2: image2Url,
        quizType: quizQuestionType,
        condition: conditionType,
        status: "SUCCESS",
        message: "Image uploaded succesfully"
    });
})

module.exports = router;
