const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: { type: String, required: true }
});

userSchema.methods.apiRepr = function () {
    return {
        id: this.id,
        email: this.image
    }
};

const User = mongoose.model('User', userSchema, 'User');

module.exports = { User }