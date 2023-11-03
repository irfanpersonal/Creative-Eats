const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide User Name'],
        minLength: 3,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Must Provide User Email'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid Email Address']
    },
    password: {
        type: String,
        required: [true, 'Must Provide User Password'],
        minLength: 5
    }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const randomBytes = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, randomBytes);
});

userSchema.methods.createJWT = function() {
    return jwt.sign(
        {userID: this._id, name: this.name, email: this.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

userSchema.methods.comparePassword = async function(guess) {
    const isCorrect = await bcrypt.compare(guess, this.password);
    return isCorrect;
}

module.exports = mongoose.model('User', userSchema);