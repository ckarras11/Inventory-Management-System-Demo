const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const { User } = require('./models/user');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();


// Password salt and hash
const bcrypt = require('bcryptjs');

// Initializing app
const app = express();
mongoose.Promise = global.Promise;

// View Engine Setup
app.set('views', path.join(__dirname, '/public/views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: `${__dirname}/public/views/layouts` }));
app.set('view engine', 'handlebars');

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Sets static public folder
app.use(express.static('public'));

// Express session middleware
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

app.use(expressValidator());

// Connect Flash
app.use(flash());

// Connect Flash messages
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.info_msg = req.flash('info_msg');
    next();
});

// Morgan logging middleware
app.use(morgan('common'));

// Routers and modules
const { DATABASE_URL, PORT, SECRET } = require('./config');
const inventoryRouter = require('./routes/inventoryRouter');
const vehicleRouter = require('./routes/vehicleRouter');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');

app.use('/api/inventory', inventoryRouter);
app.use('/api/vehicle', vehicleRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// Checks to see if user is authenticated to access protected routes
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    } else {
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
}

// Root Endpoint of App (Landing Page)
app.get('/', (req, res) => {
    res.render('index');
});

// Login Screen
app.get('/login', (req, res) => {
    res.render('login');
});

// Register
app.get('/register', (req, res) => {
    res.render('register');
});

// Home Endpoint
app.get('/home', isLoggedIn, (req, res) => {
    res.render('home');
});

// Inventory Endpoint
app.get('/inventory', isLoggedIn, (req, res) => {
    res.render('inventory');
});

// Reports Endpoint
app.get('/reports', isLoggedIn, (req, res) => {
    res.render('reports');
});

// Logout Endpoint (redirects back to login)
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('info_msg', 'You are now logged out');
    res.redirect('/login');
});

// Initializing Server
let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, (err) => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on('error', (err) => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

