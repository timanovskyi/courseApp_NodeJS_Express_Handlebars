const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img')
    res.render('courses', {
        title: 'Courses page',
        isCourses: true,
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
    res.render('course-edit', {
        title: `Edit page`,
        course
    })
})

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})


router.post('/remove', auth, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.body.id)
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router
