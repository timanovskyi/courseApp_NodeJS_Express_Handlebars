const keys = require("../keys");

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Registration became successful',
        html: `
        <h1>Welcome on board</h1>
        <p>You successfully created account with email - ${email}</p>
        <hr>
        <a href="${keys.BASE_URL}">Course app</a>
        `
    }
}
