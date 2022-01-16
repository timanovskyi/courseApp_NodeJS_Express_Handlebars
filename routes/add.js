const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add page',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('add', {
                title: 'Add page',
                isAdd: true,
                error: errors.array()[0].msg,
                data: {
                    title: req.body.title,
                    price: req.body.price,
                    img: req.body.img,
                }
            })
    }

    try {
        const course = new Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            userId: req.user
        });
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
