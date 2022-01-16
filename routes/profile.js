const {Router} = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = Router()

router.get('/', auth, async (req, res) => {
    res.render('profile',  {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth,async (req, res) => {
    try {
        const {name} = req.body;
        const user = await User.findById(req.user._id);
        const userChange = {
            name
        }
        if (req.file) {
            userChange.avatarUrl = req.file.path
        }

        Object.assign(user, userChange);
        await user.save();
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})
module.exports = router
