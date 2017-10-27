const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
        User.findOne({ email }, function (err, user) {
            console.log(user);
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                console.log('wrong password');
                return done(null, false, { message: 'Incorrect password.' });
              }
            console.log('you are logged in');
            return done(null, user);
        });
    },
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/',
    passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login', failureFlash: false }),
    function (req, res) {
        console.log('route works');
    });

module.exports = router;
