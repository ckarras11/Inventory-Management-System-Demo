const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    companyCode: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});


const User = mongoose.model('User', userSchema, 'User');

module.exports = { User };
