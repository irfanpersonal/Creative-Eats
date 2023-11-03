const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError, UnauthorizedError} = require('../errors');
const User = require('../models/User.js');
const Recipe = require('../models/Recipe.js');

const register = async(req, res) => {
    const user = await User.create(req.body);
    const token = user.createJWT();
    return res.status(StatusCodes.CREATED).json({user: {
        name: user.name,
        email: user.email,
        token
    }});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password!');
    }
    const user = await User.findOne({email});
    if (!user) {
        throw new NotFoundError('No User Found with the Email Provided!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new UnauthorizedError('Invalid Password!');
    }
    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({user: {
        name: user.name,
        email: user.email,
        token
    }});
}

const updateUser = async(req, res) => {
    const {name, email} = req.body;
    const user = await User.findOne({_id: req.user.userID});
    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    await user.save();
    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({user: {
        name: user.name,
        email: user.email,
        token
    }});
}

const adminData = async(req, res) => {
    const totalRecipes = await Recipe.countDocuments();
    return res.status(StatusCodes.OK).json({totalRecipes});
}

module.exports = {
    register,
    login,
    updateUser,
    adminData
};