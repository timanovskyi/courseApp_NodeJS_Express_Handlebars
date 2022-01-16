const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Fill the correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('This email is already used')
                }

            } catch (e) {
                console.log(e)
            }

        })
        .normalizeEmail(),
    body('password')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .withMessage('Fill the correct password')
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must be equal')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Name must be more than 3 symbols')
        .trim(),
]

exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage('Min length for title is 3'),
    body('price').isNumeric().withMessage('Fill the correct value'),
    body('img', 'Fill the correct url for image').isURL()
]
