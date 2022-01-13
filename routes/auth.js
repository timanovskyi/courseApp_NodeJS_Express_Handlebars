const {Router} = require('express');
const router = Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require("../keys");
const registration = require("../emails/registration");
const crypto = require('crypto')
const resetEmail = require('../emails/reset')
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login page',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.get('/reset', async (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
       return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        }

        res.render('auth/password', {
            title: 'Recup the access',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(error => {
                    if (error) {
                        throw error
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'The password isn\'t correct');
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'There is no user with this email');
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body;
        const candidate = await User.findOne({email})

        if (candidate) {
            req.flash('registerError', 'User exists with this email');
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({email, name, password: hashPassword, cart: {items: []}})
            await user.save();
            await transporter.sendMail(registration(email))
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/reset', (req, res) => {
    try {
       crypto.randomBytes(32, async (err, buf) => {
           if (err) {
             req.flash('error', 'Something is wrong, try again later');
             return res.redirect('/auth/reset')
           }

           const token = buf.toString('hex');
           const candidate = await User.findOne({email: req.body.email})

           if (candidate) {
               candidate.resetToken = token;
               candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;

               await candidate.save();
               await transporter.sendMail((resetEmail(candidate.email, token)))
               res.redirect('/auth/login')
           } else {
               req.flash('error', 'There is no email');
               return res.redirect('/auth/reset')
           }
       })
    } catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
        _id: req.body.userId.toString(),
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            req.flash('loginError', 'Time of token was expired')
            return res.redirect('/auth/login')
        }

        user.password = await bcrypt.hash(req.body.password, 10)
        user.resetToken = undefined;
        user.resetTokenExp = undefined;

        await user.save()
        res.redirect('/auth/login')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router
