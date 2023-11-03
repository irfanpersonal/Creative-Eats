const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');
const Recipe = require('../models/Recipe.js');
const path = require('node:path');
const cloudinary = require('cloudinary').v2;
const fs = require('node:fs');

const getAllRecipes = async(req, res) => {
    const queryObject = {};
    const {search, sort} = req.query;
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = Recipe.find(queryObject);
    if (sort) {
        const fixedSort = sort.split(',').join(' ');
        result = result.sort(fixedSort);
    }
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const recipes = await result;
    const totalRecipes = await Recipe.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalRecipes / limit);
    return res.status(StatusCodes.OK).json({recipes, totalRecipes, numberOfPages});
}

const createRecipe = async(req, res) => {
    const {name, description, ingredients, instructions} = req.body;
    if (!name || !description || !ingredients || !instructions || !req?.files?.foodImage) {
        throw new BadRequestError('Please provide all inputs');
    }
    const image = req.files.foodImage;
    if (!image.mimetype.startsWith('image')) {
        throw new BadRequestError('File must be Image');
    }
    const limit = 1000000 * 2;
    if (image.size > limit) {
        throw new BadRequestError('Image Must Be Below 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + image.name;
    const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
    await image.mv(destination);
    const result = await cloudinary.uploader.upload(destination, {
        use_filename: true,
        folder: 'CREATIVE-EATS-API-IMAGES'
    });
    req.body.foodImage = result.secure_url;
    await fs.unlink(destination, (error) => {
        if (error) {
            console.log(error);
        }
    });
    req.body.createdBy = req.user.userID;
    const recipe = await Recipe.create(req.body);
    return res.status(StatusCodes.CREATED).json({recipe});
}

const getSingleRecipe = async(req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findOne({_id: id}).populate('createdBy', 'name');
    if (!recipe) {
        throw new NotFoundError('No Recipe Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({recipe});
}

const updateSingleRecipe = async(req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findOne({_id: id, createdBy: req.user.userID});
    if (!recipe) {
        throw new NotFoundError('No Recipe Found with the ID Provided!');
    }
    const {name, description, ingredients, foodImage, instructions} = req.body;
    if (name) {
        recipe.name = name;
    }
    if (description) {
        recipe.description = description;
    }
    if (ingredients) {
        recipe.ingredients = ingredients;
    }
    if (instructions) {
        recipe.instructions = instructions;
    }
    if (req?.files?.foodImage) {    
        const image = req.files.foodImage;
        if (!image.mimetype.startsWith('image')) {
            throw new BadRequestError('File must be Image');
        }
        const limit = 1000000 * 2;
        if (image.size > limit) {
            throw new BadRequestError('Image Must Be Below 2MB!');
        }
        const imageIdentifier = recipe.foodImage.split('/CREATIVE-EATS-API-IMAGES/')[1].split('.')[0];
        await cloudinary.uploader.destroy(`CREATIVE-EATS-API-IMAGES/${imageIdentifier}`);
        const uniqueIdentifier = new Date().getTime() + '_' + image.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await image.mv(destination);
        const result = await cloudinary.uploader.upload(destination, {
            use_filename: true,
            folder: 'CREATIVE-EATS-API-IMAGES'
        });
        recipe.foodImage = result.secure_url;
        await fs.unlink(destination, (error) => {
            if (error) {
                console.log(error);
            }
        });
    }
    await recipe.save();
    return res.status(StatusCodes.OK).json({recipe});
}

const deleteSingleRecipe = async(req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findOneAndDelete({_id: id, createdBy: req.user.userID});
    if (!recipe) {
        throw new NotFoundError('No Recipe Found with the ID Provided!');
    }
    const imageIdentifier = recipe.foodImage.split('/CREATIVE-EATS-API-IMAGES/')[1].split('.')[0];
    await cloudinary.uploader.destroy(`CREATIVE-EATS-API-IMAGES/${imageIdentifier}`);
    return res.status(StatusCodes.OK).json({recipe});
}

module.exports = {
    getAllRecipes,
    createRecipe,
    getSingleRecipe,
    updateSingleRecipe,
    deleteSingleRecipe
};