const keys = require("../keys");

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Recup the access',
        html: `
        <h1>You forgot password?</h1>
        <p>If no, please ignorace this email</p>
        <p>Else, please click the link:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Recup the access</a></p>
        <hr>
        <a href="${keys.BASE_URL}">Course app</a>
        `
    }
}
