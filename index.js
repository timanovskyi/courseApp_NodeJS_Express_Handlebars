const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const helmet = require('helmet')
const compression = require('compression')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const fileMiddleware = require('./middleware/file')

const keys = require('./keys/index')
const PORT = process.env.PORT || 3000;

//routes
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

//add handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:  require('./utils/hbs-helpers')
})
app.engine('hbs', hbs.engine)

//set static
app.set('view engine', 'hbs')
app.set('views', 'views')

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URL
})

//app use
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(varMiddleware);
app.use(userMiddleware);
app.use(helmet());
app.use(compression());

//app use routers
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorMiddleware)

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URL, {
            useNewUrlParser: true
        });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${3000}`)
        });
    } catch (e) {
        console.log(e)
    }
}

start();
