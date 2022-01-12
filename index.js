const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const csrf = require('csurf');
const flash = require('connect-flash')

const MONGODB_URL = `mongodb+srv://egor:3Yhy2yvsXr7R33ps@cluster0.jgjxf.mongodb.net/shop`

//routes
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');


//add handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URL
})

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('61daba95f3b1fc0dde4aabce');
//         req.user = user;
//         next();
//     } catch (e) {
//         console.log(e)
//     }
// })

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave: true,
    saveUninitialized: false,
    store
}))

app.use(csrf())
app.use(flash())
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;

async function start() {
    try {

        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true
        });
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'test@gmail.com',
        //         name: 'test',
        //         cart: {
        //             items: []
        //         }
        //     })
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${3000}`)
        });
    } catch (e) {
        console.log(e)
    }
}

start();
