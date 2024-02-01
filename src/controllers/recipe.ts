import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import CustomError from '../errors';
import Recipe, {IRecipe} from '../models/Recipe';
import {ITokenPayload} from '../utils';
import {UploadedFile} from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'node:fs';
import mongoose from 'mongoose';
import User from '../models/User';

interface RecipeRequest extends Request {
    user?: ITokenPayload,
    body: IRecipe,
    params: {
        id: string
    },
    query: {
        search: string,
        username: string,
        category: string,
        sort: 'a-z' | 'z-a',
        minimumBudget: string,
        maximumBudget: string
        limit: string,
        page: string
    }
}

interface IQueryObject {
    name: {$regex: string, $options: string},
    user: string,
    category: string,
    budget: {$gte: number, $lte: number}
}

const getAllRecipes = async(req: RecipeRequest, res: Response) => {
    const {search, username, sort, category, minimumBudget, maximumBudget} = req.query;
    const queryObject: Partial<IQueryObject> = {}
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    if (username) {
        queryObject.user = username;
    }
    if (category) {
        queryObject.category = category;
    }
    if (minimumBudget && maximumBudget) {
        queryObject.budget = {$gte: Number(minimumBudget), $lte: Number(maximumBudget)};
    }
    let result = Recipe.find(queryObject).populate({
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
    const recipes = await result;
    const totalRecipes = await Recipe.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalRecipes / limit);
    return res.status(StatusCodes.OK).json({recipes, totalRecipes, numberOfPages});
}

const createRecipe = async(req: RecipeRequest, res: Response) => {
    const {name, description, category, ingredients, budget, instructions} = req.body;
    if (!name || !description || !category || !ingredients || !budget || !instructions) {
        const coverImage = req.files?.coverImage as UploadedFile;
        if (coverImage) {
            await fs.unlink(coverImage.tempFilePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        throw new CustomError.BadRequestError('Please provide/check all inputs for recipe creation!');
    }
    if (!req.files?.coverImage) {
        throw new CustomError.BadRequestError('Please provide a cover image!');
    }
    const coverImage = req.files.coverImage as UploadedFile;
    if (!coverImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('File must be an image!');
    }
    if (coverImage.size > 1000000 * 2) {
        throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'recipe' + '_' + coverImage.name;
    const result = await cloudinary.uploader.upload(coverImage.tempFilePath, {
        public_id: uniqueIdentifier, 
        folder: 'CREATIVE-EATS/COVER_IMAGES'
    });
    await fs.unlink(coverImage.tempFilePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    req.body.coverImage = result.secure_url;
    req.body.user = req.user!.userID as unknown as mongoose.Schema.Types.ObjectId;
    const recipe = await Recipe.create(req.body);
    return res.status(StatusCodes.OK).json({recipe});
}

const getSingleRecipe = async(req: RecipeRequest, res: Response) => {
    const {id} = req.params;
    const recipe = await Recipe.findOne({_id: id}).populate({
        path: 'user',
        select: 'name email profilePicture'
    });
    if (!recipe) {
        throw new CustomError.NotFoundError('No Recipe Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({recipe});
}

const updateSingleRecipe = async(req: RecipeRequest, res: Response) => {
    const {id} = req.params;
    const recipe = (await Recipe.findOneAndUpdate({_id: id, user: req.user!.userID}, req.body, {
        new: true,
        runValidators: true
    }).populate('user'))!;
    if (req.files?.coverImage) {
        const coverImage = req.files.coverImage as UploadedFile;
        if (!coverImage.mimetype.startsWith('image')) {
            throw new CustomError.BadRequestError('File must be an image!');
        }
        if (coverImage.size > 1000000 * 2) {
            throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'recipe' + '_' + coverImage.name;
        const oldImage = recipe.coverImage.substring(recipe.coverImage.indexOf('CREATIVE'));
        await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        const result = await cloudinary.uploader.upload(coverImage.tempFilePath, {
            public_id: uniqueIdentifier,
            folder: 'CREATIVE-EATS/COVER_IMAGES'
        });
        await fs.unlink(coverImage.tempFilePath, (err) => {
            if (err) {
                console.log(err);
            }
        });
        recipe.coverImage = result.secure_url;
    }
    await recipe.save();
    return res.status(StatusCodes.OK).json({recipe});
}

const deleteSingleRecipe = async(req: RecipeRequest, res: Response) => {
    const {id} = req.params;
    const recipe = await Recipe.findOne({_id: id, user: req.user!.userID});
    if (!recipe) {
        throw new CustomError.NotFoundError('No Recipe Found with the ID Provided!');
    }
    const currentImage = recipe.coverImage.substring(recipe.coverImage.indexOf('CREATIVE'));
    await cloudinary.uploader.destroy(currentImage.substring(0, currentImage.lastIndexOf('.')));
    await recipe.deleteOne();
    return res.status(StatusCodes.OK).send();
}

interface GetUserFeedQueryObject {
    user: {$in: string[]},
    name: {$regex: string, $options: string}
}

const getUserFeed = async(req: RecipeRequest, res: Response) => {
    const {search} = req.query;
    const followingArray = (await User.findOne({_id: req.user!.userID}).select('following'))!;
    const followingIds = followingArray.following.map(user => user.toString());
    const queryObject: Partial<GetUserFeedQueryObject> = {
        user: {$in: followingIds}
    }
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = Recipe.find(queryObject).populate({
        path: 'user',
        select: 'name email profilePicture'
    });
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const recipes = await result;
    const totalRecipes = await Recipe.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalRecipes / limit);
    return res.status(StatusCodes.OK).json({recipes, totalRecipes, numberOfPages});
}

export {
    getAllRecipes,
    createRecipe,
    getSingleRecipe,
    updateSingleRecipe,
    deleteSingleRecipe,
    getUserFeed
};