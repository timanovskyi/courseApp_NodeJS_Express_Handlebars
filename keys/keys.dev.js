const privateKeys = require('../privateKeys')

module.exports = {
    MONGODB_URL: 'mongodb+srv://egor:3Yhy2yvsXr7R33ps@cluster0.jgjxf.mongodb.net/shop',
    SESSION_SECRET: 'some secret value',
    SENDGRID_API_KEY: privateKeys.SENDGRID_API_KEY,
    EMAIL_FROM: privateKeys.EMAIL_FROM,
    BASE_URL: 'http://localhost:3000'
}
