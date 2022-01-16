const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './images/')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
});

const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
]

const fileFilter = (req, file, cb) => {
    console.log(file);
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})
