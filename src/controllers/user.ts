import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {ITokenPayload} from '../utils';
import User, {IUser} from '../models/User';
import CustomError from '../errors';
import {UploadedFile} from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'node:fs';
import Recipe from '../models/Recipe';
import mongoose from 'mongoose';

interface UserRequest extends Request {
    body: IUser & {
        oldPassword: string,
        newPassword: string
    },
    user?: ITokenPayload,
    query: {
        search: string,
        sort: 'a-z' | 'z-a',
        limit: string,
        page: string
    },
    params: {
        id: string
    }
}

const showCurrentUser = async(req: UserRequest, res: Response) => {
    return res.status(StatusCodes.OK).json({user: req.user});
}

interface IQueryObject {
    name?: {$regex: string, $options: string}
}

const getAllUsers = async(req: UserRequest, res: Response) => {
    const {search, sort} = req.query;
    const queryObject: IQueryObject = {}
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = User.find(queryObject);
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
    const users = await result.select('-password');
    const totalUsers = await User.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(StatusCodes.OK).json({users, totalUsers, numberOfPages});
}

const getSingleUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    const user = await User.findOne({_id: id}).select('-password').populate({
        path: 'following followers',
        select: 'name profilePicture'
    });;
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({user});
}

const updateUser = async(req: UserRequest, res: Response) => {
    const user = (await User.findOneAndUpdate({_id: req.user!.userID}, req.body, {
        new: true,
        runValidators: true,
    }))!;
    if (req.files?.profilePicture) {
        const profilePicture = req.files.profilePicture as UploadedFile;
        console.log(profilePicture);
        if (!profilePicture.mimetype.startsWith('image')) {
            throw new CustomError.BadRequestError('File Type Must be Image!');
        }
        if (profilePicture.size > 1000000 * 2) {
            throw new CustomError.BadRequestError('Image Size cannot exceed 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + user.name + '_' + 'profile' + '_' + profilePicture.name;
        const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('CREATIVE'));
        await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        const result = await cloudinary.uploader.upload(profilePicture.tempFilePath, {
            public_id: uniqueIdentifier, 
            folder: 'CREATIVE-EATS/PROFILE_IMAGES'
        });
        user.profilePicture = result.secure_url;
        await fs.unlink(profilePicture.tempFilePath, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    await user.save();
    return res.status(StatusCodes.OK).json({user});
}

const updateUserPassword = async(req: UserRequest, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (await User.findOne({_id: req.user!.userID}))!;
    const isCorrect = await user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email
    }});
}

const deleteAccount = async(req: UserRequest, res: Response) => {
    const {password} = req.body;
    const user = (await User.findOne({_id: req.user!.userID}))!;
    if (!password) {
        throw new CustomError.BadRequestError('Please provide password!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Password');
    }
    await user.deleteOne();
    res.clearCookie('token');
    // Delete Profile Picture
    const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('CREATIVE'));
    await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
    // Delete All Recipe Images
    await (await Recipe.find({user: req.user!.userID}).select('coverImage')).map(image => {
        const oldImage = image.coverImage.substring(image.coverImage.indexOf('CREATIVE'));
        return oldImage.substring(0, oldImage.lastIndexOf('.'));
    }).forEach(async function(image) {
        await cloudinary.uploader.destroy(image);
    });
    // Delete All Recipe Posts
    await Recipe.deleteMany({user: req.user!.userID});
    // Delete ID off any Following or Followers
    const userIdToRemove = req.user!.userID as any;
    const usersWithMyID = await User.find({
        $or: [
            {following: userIdToRemove},
            {followers: userIdToRemove}
        ]
    });
    await Promise.all(usersWithMyID.map(async user => {
        if (user.following.includes(userIdToRemove)) {
            (user.following as any).pull(userIdToRemove);
        }
        if (user.followers.includes(userIdToRemove)) {
            (user.followers as any).pull(userIdToRemove);
        }
        await user.save();
    }));
    return res.status(StatusCodes.OK).send();
}

const followUser = async (req: UserRequest, res: Response) => {
    const {id} = req.params;
    if (id === req.user!.userID) {
        throw new CustomError.NotFoundError('You cant follow yourself.');
    }
    const user = (await User.findOne({_id: req.user!.userID}))!;
    if (user.following.includes(id as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new CustomError.BadRequestError('You are already following the user.');
    }
    const [findUser, findTargetUser] = await Promise.all([
        User.findOneAndUpdate({_id: req.user!.userID}, {$addToSet: {following: id}}),
        User.findOneAndUpdate({_id: id}, {$addToSet: {followers: req.user!.userID}})
    ]);
    if (!findUser || !findTargetUser) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    const updatedUser = await User.findOne({_id: id}).populate('followers following');
    return res.status(StatusCodes.OK).json({msg: 'Successfully Followed Provided User!', user: updatedUser});
}

const unfollowUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    if (id === req.user!.userID) {
        throw new CustomError.NotFoundError('You cant follow yourself.');
    }
    const isFollowing = await User.exists({_id: req.user!.userID, following: id});
    if (!isFollowing) {
        throw new CustomError.BadRequestError(`You cant unfollow someone you aren't followed to.`);
    }
    const [findUser, findTargetUser] = await Promise.all([
        User.findOneAndUpdate({_id: req.user!.userID}, {$pull: {following: id}}),
        User.findOneAndUpdate({_id: id}, {$pull: {followers: req.user!.userID}})
    ]);
    if (!findUser || !findTargetUser) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    const updatedUser = await User.findOne({_id: id}).populate('followers following');
    return res.status(StatusCodes.OK).json({msg: 'Successfully Unfollowed Provided User!', user: updatedUser});
}

export {
    showCurrentUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    deleteAccount,
    followUser,
    unfollowUser
};