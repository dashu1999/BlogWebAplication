const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { json } = require('express/lib/response')
const { kirimEmail } = require('../middleware/mailSend')
const { EMAIL } = require('../config/keys')




router.post('/signup', (req, res) => {
    var { username, name, email, password, pic } = req.body
    if (!username || !email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    if (username.length < 6) {
        return res.status(422).json({ error: `Your username must be having 6 or more characters. You have entered only ${username.length} characters.` })
    }
    if (username.length > 30) {
        return res.status(422).json({ error: `Your username must not be having more than 30 characters. You have entered ${username.length} characters.` })
    }
    if (name.length > 30) {
        return res.status(422).json({ error: `Your name must not be having more than 30 characters. You have entered ${name.length} characters.` })
    }
    User.findOne({ username: username })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Username already taken" })
            }
            User.findOne({ name: name })
                .then((savedUser) => {
                    if (savedUser) {
                        return res.status(422).json({ error: "Name already taken" })
                    }
                    User.findOne({ email: email })
                        .then((savedUser) => {
                            if (savedUser) {
                                return res.status(422).json({ error: "User already exists with this email" })
                            }
                            bcrypt.hash(password, 12)
                                .then(hashedpassword => {
                                    const user = new User({
                                        username,
                                        email,
                                        password: hashedpassword,
                                        name,
                                        pic
                                    })
                                    user.save()

                                        .then(user => {
                                            const templateEmail = {
                                                to: user.email, // Change to your recipient
                                                from: 'DBlogger@gmail.com', // Change to your verified sender
                                                subject: 'Welcome to DBlogger',
                                                text: 'Explore and enjoy beautiful posts and videos by making a lot of friends online',
                                                html: `Hii <strong>${user.username}</strong> Welcome to <strong>DBlogger</strong><br> 
              Explore and enjoy beautiful posts and videos by making a lot of friends online.
              Wish you a very good time on <strong>DBlogger</strong>. Mail us in case you face any issues. We will try to get back to you as soon as possible.`
                                            }
                                            kirimEmail(templateEmail)
                                                .then(() => {
                                                    console.log('Email sent')
                                                })
                                                .catch((error) => {
                                                    console.error(error)
                                                })
                                            res.json({ message: "Signed Up successfully" })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                })
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password." })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invaild Email or Password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // return res.json({message:"Successfully Signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, username, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, username, followers, following, pic } })
                    } else {
                        return res.status(422).json({ error: "Invaild Email or Password" })
                    }

                })
                .catch(err => {
                    console.log(err)
                })
        })
})


router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422), json({ error: "User don't exists with that Email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    const templateEmail = {
                        to: user.email, // Change to your recipient
                        from: 'DBlogger@gmail.com', // Change to your verified sender
                        subject: 'Password Reset Request',
                        text: 'Explore and enjoy beautiful posts and videos by making a lot of friends online',
                        html: `Hii <strong>${user.username}</strong> we received your <strong>DBlogger</strong> password change request<br>
                               <h1>Click on this <a href="${EMAIL}/reset/${token}">Reset Password</a> to reset the password
                               This link expires after 1 hour.
                               </h1>`,
                    }
                    kirimEmail(templateEmail)

                    return res.status(200).json({
                        status: true,
                        message: "Check your Email"
                    })
                })

            })
    })
});

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((user) => {
                    const templateEmail = {
                        to: user.email, // Change to your recipient
                        from: 'DBlogger@gmail.com', // Change to your verified sender
                        subject: 'Password Updated Successfully',
                        text: 'Explore and enjoy beautiful posts and videos by making a lot of friends online',
                        html: `Hii <strong>${user.username}</strong> your password was changed as per your request<br>
                             <h2>Have a good day..!!!</h2>`
                    }
                    kirimEmail(templateEmail)
                        .then(() => {
                            console.log('Email sent')
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                    res.json({ message: "Password updated successfully" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})


router.post('/change-email', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "Invalid user credentials" })
                }
                user.resetEmailToken = token
                user.expireEmailToken = Date.now() + 3600000
                user.save().then((result) => {
                    const templateEmail = {
                        to: user.email, // Change to your recipient
                        from: 'creativetech1142@gmail.com', // Change to your verified sender
                        subject: 'Email Change Request',
                        text: 'Explore and enjoy beautiful posts and videos by making a lot of friends online',
                        html: `Hii <strong>${user.username}</strong> we received your <strong>DBlogger</strong> email change request<br>
                     <h1>Click on this <a href="${EMAIL}/changeEmail/${token}">Change Email</a> to change the email</h1>`,
                    }
                    kirimEmail(templateEmail)
                        .then(() => {
                            console.log('Email sent')
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                    res.json({ message: "Please check your current email messages to receive a link to change the email" })
                })

            })
    })
})


router.post('/new-email', (req, res) => {
    const newEmail = req.body.email
    const sentToken = req.body.token
    User.findOne({ email: req.body.email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "This email is already taken. Please try a different one" })
            }
            User.findOne({ resetEmailToken: sentToken, expireEmailToken: { $gt: Date.now() } })
                .then(user => {
                    if (!user) {
                        return res.status(422).json({ error: "Please try again, the session expires after one hour" })
                    }
                    user.email = newEmail
                    user.resetEmailToken = undefined
                    user.expireEmailToken = undefined
                    user.save().then((user) => {
                        const templateEmail = {
                            to: user.email, // Change to your recipient
                            from: 'DBlogger@gmail.com', // Change to your verified sender
                            subject: 'Email updated successfully',
                            text: 'Explore and enjoy beautiful posts and videos by making a lot of friends online',
                            html: `Hii <strong>${user.username}</strong> your email was changed as per your request<br>
                     <h2>Have a good day..!!!</h2>`
                        }
                        kirimEmail(templateEmail)
                            .then(() => {
                                console.log('Email sent')
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                        res.json({ message: "Email changed successfully. Check your new email inbox to receive the message" })
                    })
                }).catch(err => {
                    console.log(err)
                })
        })

})

router.post('/change-username', (req, res) => {
    const newUsername = req.body.username
    User.findOne({ username: req.body.username })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "This username is already taken. Please try a different one" })
            }
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (!user) {
                        return res.status(422).json({ error: "Invalid Credentials" })
                    }
                    if (newUsername.length < 6) {
                        return res.status(422).json({ error: `Your username must be having 6 or more characters. You have entered only ${newUsername.length} characters.` })
                    }
                    if (newUsername.length > 30) {
                        return res.status(422).json({ error: `Your username must not be having more than 30 characters. You have entered ${newUsername.length} characters.` })
                    }
                    user.username = newUsername
                    user.save().then((user) => {
                        res.json({ message: "Username changed successfully." })
                    })
                }).catch(err => {
                    console.log(err)
                })
        })
})


router.post('/change-name', (req, res) => {
    const newName = req.body.name
    User.findOne({ name: req.body.name })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "This name is already taken. Please try a different one" })
            }
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (!user) {
                        return res.status(422).json({ error: "Invalid Credentials" })
                    }
                    if (newName.length > 30) {
                        return res.status(422).json({ error: `Your name must not be having more than 30 characters. You have entered ${newName.length} characters.` })
                    }
                    user.name = newName
                    user.save().then((user) => {
                        res.json({ message: "Name changed successfully." })
                    })
                }).catch(err => {
                    console.log(err)
                })
        })
})


router.post('/delete-account', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(422).json({ error: "Invalid credentials" })
        }
        user.save().then((user) => {
            const templateEmail = {
                to: user.email, // Change to your recipient
                //   from: 'DBlogger@gmail.com', // Change to your verified sender
                subject: 'Delete Account Request',
                text: 'Explore and enjoy beautiful posts and videos by making a lot of friends online',
                html: `Hii <strong>${user.username}</strong> we have seen your request for deleting the account. You are just one step away now. Kindly email us the reason behind deleting it and get it deleted permanently.<br>
                   <h2>Have a good day..!!!</h2>`
            }
            kirimEmail(templateEmail)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
            res.json({ message: "Check your email messages for further information" })
        })
    })
})

//   router.post('/dob', (req, res) => {
//     const newDob = req.body.dob
//     User.findOne({ dob: req.body.dob })
//       .then(savedUser => {        
//         User.findOne({ email: req.body.email })
//           .then(user => {
//             user.dob = newdob
//             user.save().then((user) => {
//               res.json({ message: "Name changed successfully." })
//             })
//           }).catch(err => {
//             console.log(err)
//           })
//       })
//   })

module.exports = router
