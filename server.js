const express = require('express');
const morgan = require('morgan');

const app = express();
const mongoose = require('mongoose');
// Password salt and hash
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('B4c0/\/', salt);
const session = require('express-session');
const bodyParser = require('body-parser');
const { BasicStrategy } = require('passport-http');
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


const { Vehicle } = require('./models/vehicle');
const { User } = require('./models/user');
const { DATABASE_URL, PORT } = require('./config');
const inventoryRouter = require('./routes/inventoryRouter');
const vehicleRouter = require('./routes/vehicleRouter');

mongoose.Promise = global.Promise;


/* passport.use(new LocalStrategy({ usernameField: 'email' },
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
)); */

passport.use(new BasicStrategy(((username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    })));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


app.use(express.static('public'));
app.use(morgan('common'));
app.use(session({ secret: 'parker' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use('/api/inventory', inventoryRouter);
app.use('/api/vehicle', vehicleRouter);

// Root Endpoint of App (Login Screen)
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

/* app.post('/',
    passport.authenticate('basic', {
        successRedirect: '/home',
        failureRedirect: '/'
    })); */

// Home Endpoint
app.get('/home', (req, res) => {
    res.sendFile(`${__dirname}/public/views/home.html`);
});

// Inventory Endpoint
// Serves Inventory Page
app.get('/inventory', (req, res) => {
    res.sendFile(`${__dirname}/public/views/inventory.html`);
});

// Reports Endpoint
app.get('/reports', (req, res) => {
    res.sendFile(`${__dirname}/public/views/reports.html`);
});

// Logout Endpoint
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

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

