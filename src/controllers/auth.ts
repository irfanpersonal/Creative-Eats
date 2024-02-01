import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import User from '../models/User';
import {createToken, createCookieWithToken} from '../utils/index';
import CustomError from '../errors';
import {v2 as cloudinary} from 'cloudinary';
import {UploadedFile} from 'express-fileupload';
import fs from 'node:fs';

interface IRequest extends Request {
    body: {
        name: string,
        email: string,
        password: string,
        profilePicture: string
    }
}

const register = async(req: IRequest, res: Response) => {
    const {name} = req.body;
    if (!req.files?.profilePicture) {
        throw new CustomError.BadRequestError('Please provide a profile picture!');
    }
    const profilePicture = req.files.profilePicture as UploadedFile;
    if (!profilePicture.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('File Type Must be Image!');
    }
    if (profilePicture.size > 1000000 * 2) {
        throw new CustomError.BadRequestError('Image Size cannot exceed 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + name + '_' + 'profile' + '_' + profilePicture.name;
    req.body.profilePicture = 'SETTING A VALUE FOR NOW SO I CAN SATISFY MONGOOSE';
    const user = await User.create(req.body);
    const result = await cloudinary.uploader.upload(profilePicture.tempFilePath, {
        public_id: uniqueIdentifier, 
        folder: 'CREATIVE-EATS/PROFILE_IMAGES' 
    });
    user.profilePicture = result.secure_url;
    await user.save();
    await fs.unlink(profilePicture.tempFilePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    const token = createToken(user);
    createCookieWithToken(res, token);
    return res.status(StatusCodes.CREATED).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email
    }});
}

const login = async(req: IRequest, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password!');
    }
    const user = await User.findOne({email});
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the Email Provided!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Password!');
    }
    const token = createToken(user);
    createCookieWithToken(res, token);
    return res.status(StatusCodes.OK).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email
    }});
}

const logout = async(req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(StatusCodes.OK).json({msg: 'Successfully Logged Out!'});
}

export {
    register,
    login,
    logout
};