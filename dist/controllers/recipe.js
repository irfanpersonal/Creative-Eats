"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFeed = exports.deleteSingleRecipe = exports.updateSingleRecipe = exports.getSingleRecipe = exports.createRecipe = exports.getAllRecipes = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const Recipe_1 = __importDefault(require("../models/Recipe"));
const cloudinary_1 = require("cloudinary");
const node_fs_1 = __importDefault(require("node:fs"));
const User_1 = __importDefault(require("../models/User"));
const getAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, username, sort, category, minimumBudget, maximumBudget } = req.query;
    const queryObject = {};
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    if (username) {
        queryObject.user = username;
    }
    if (category) {
        queryObject.category = category;
    }
    if (minimumBudget && maximumBudget) {
        queryObject.budget = { $gte: Number(minimumBudget), $lte: Number(maximumBudget) };
    }
    let result = Recipe_1.default.find(queryObject).populate({
        path: 'user',
        select: 'name email profilePicture'
    });
    if (sort === 'a-z') {
        result = result.sort('name');
    }
    if (sort === 'z-a') {
        result = result.sort('-name');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const recipes = yield result;
    const totalRecipes = yield Recipe_1.default.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalRecipes / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ recipes, totalRecipes, numberOfPages });
});
exports.getAllRecipes = getAllRecipes;
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, description, category, ingredients, budget, instructions } = req.body;
    if (!name || !description || !category || !ingredients || !budget || !instructions) {
        const coverImage = (_a = req.files) === null || _a === void 0 ? void 0 : _a.coverImage;
        if (coverImage) {
            yield node_fs_1.default.unlink(coverImage.tempFilePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        throw new errors_1.default.BadRequestError('Please provide/check all inputs for recipe creation!');
    }
    if (!((_b = req.files) === null || _b === void 0 ? void 0 : _b.coverImage)) {
        throw new errors_1.default.BadRequestError('Please provide a cover image!');
    }
    const coverImage = req.files.coverImage;
    if (!coverImage.mimetype.startsWith('image')) {
        throw new errors_1.default.BadRequestError('File must be an image!');
    }
    if (coverImage.size > 1000000 * 2) {
        throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'recipe' + '_' + coverImage.name;
    const result = yield cloudinary_1.v2.uploader.upload(coverImage.tempFilePath, {
        public_id: uniqueIdentifier,
        folder: 'CREATIVE-EATS/COVER_IMAGES'
    });
    yield node_fs_1.default.unlink(coverImage.tempFilePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    req.body.coverImage = result.secure_url;
    req.body.user = req.user.userID;
    const recipe = yield Recipe_1.default.create(req.body);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ recipe });
});
exports.createRecipe = createRecipe;
const getSingleRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const recipe = yield Recipe_1.default.findOne({ _id: id }).populate({
        path: 'user',
        select: 'name email profilePicture'
    });
    if (!recipe) {
        throw new errors_1.default.NotFoundError('No Recipe Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ recipe });
});
exports.getSingleRecipe = getSingleRecipe;
const updateSingleRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id } = req.params;
    const recipe = (yield Recipe_1.default.findOneAndUpdate({ _id: id, user: req.user.userID }, req.body, {
        new: true,
        runValidators: true
    }).populate('user'));
    if ((_c = req.files) === null || _c === void 0 ? void 0 : _c.coverImage) {
        const coverImage = req.files.coverImage;
        if (!coverImage.mimetype.startsWith('image')) {
            throw new errors_1.default.BadRequestError('File must be an image!');
        }
        if (coverImage.size > 1000000 * 2) {
            throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'recipe' + '_' + coverImage.name;
        const oldImage = recipe.coverImage.substring(recipe.coverImage.indexOf('CREATIVE'));
        yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        const result = yield cloudinary_1.v2.uploader.upload(coverImage.tempFilePath, {
            public_id: uniqueIdentifier,
            folder: 'CREATIVE-EATS/COVER_IMAGES'
        });
        yield node_fs_1.default.unlink(coverImage.tempFilePath, (err) => {
            if (err) {
                console.log(err);
            }
        });
        recipe.coverImage = result.secure_url;
    }
    yield recipe.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ recipe });
});
exports.updateSingleRecipe = updateSingleRecipe;
const deleteSingleRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const recipe = yield Recipe_1.default.findOne({ _id: id, user: req.user.userID });
    if (!recipe) {
        throw new errors_1.default.NotFoundError('No Recipe Found with the ID Provided!');
    }
    const currentImage = recipe.coverImage.substring(recipe.coverImage.indexOf('CREATIVE'));
    yield cloudinary_1.v2.uploader.destroy(currentImage.substring(0, currentImage.lastIndexOf('.')));
    yield recipe.deleteOne();
    return res.status(http_status_codes_1.StatusCodes.OK).send();
});
exports.deleteSingleRecipe = deleteSingleRecipe;
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const followingArray = (yield User_1.default.findOne({ _id: req.user.userID }).select('following'));
    const followingIds = followingArray.following.map(user => user.toString());
    const queryObject = {
        user: { $in: followingIds }
    };
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    let result = Recipe_1.default.find(queryObject).populate({
        path: 'user',
        select: 'name email profilePicture'
    });
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const recipes = yield result;
    const totalRecipes = yield Recipe_1.default.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalRecipes / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ recipes, totalRecipes, numberOfPages });
});
exports.getUserFeed = getUserFeed;
