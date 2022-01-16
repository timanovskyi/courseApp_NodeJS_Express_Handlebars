const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img')
    res.render('courses', {
        title: 'Courses page',
        isCourses: true,
        userId: req.user ? req.user._id.toString() : null,
        courses
    })
})


router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})


router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id);
    if (course.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/courses')
    }
    res.render('course-edit', {
        title: `Edit page`,
        course
    })
})

router.post('/edit', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req);
    const {id} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422)
            .redirect(`/cpurses/${id}/edit?allow=true`)
    }

    delete req.body.id;
    const course = await Course.findById(id)
    if (course.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/courses')
    }
    Object.assign(course, req.body)
    await course.save();
    res.redirect('/courses')
})


router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router
