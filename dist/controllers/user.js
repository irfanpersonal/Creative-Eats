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
exports.unfollowUser = exports.followUser = exports.deleteAccount = exports.updateUserPassword = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.showCurrentUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const errors_1 = __importDefault(require("../errors"));
const cloudinary_1 = require("cloudinary");
const node_fs_1 = __importDefault(require("node:fs"));
const Recipe_1 = __importDefault(require("../models/Recipe"));
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, sort } = req.query;
    const queryObject = {};
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    let result = User_1.default.find(queryObject);
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
    const users = yield result.select('-password');
    const totalUsers = yield User_1.default.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ users, totalUsers, numberOfPages });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.default.findOne({ _id: id }).select('-password').populate({
        path: 'following followers',
        select: 'name profilePicture'
    });
    ;
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = (yield User_1.default.findOneAndUpdate({ _id: req.user.userID }, req.body, {
        new: true,
        runValidators: true,
    }));
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.profilePicture) {
        const profilePicture = req.files.profilePicture;
        console.log(profilePicture);
        if (!profilePicture.mimetype.startsWith('image')) {
            throw new errors_1.default.BadRequestError('File Type Must be Image!');
        }
        if (profilePicture.size > 1000000 * 2) {
            throw new errors_1.default.BadRequestError('Image Size cannot exceed 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + user.name + '_' + 'profile' + '_' + profilePicture.name;
        const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('CREATIVE'));
        yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        const result = yield cloudinary_1.v2.uploader.upload(profilePicture.tempFilePath, {
            public_id: uniqueIdentifier,
            folder: 'CREATIVE-EATS/PROFILE_IMAGES'
        });
        user.profilePicture = result.secure_url;
        yield node_fs_1.default.unlink(profilePicture.tempFilePath, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    yield user.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (yield User_1.default.findOne({ _id: req.user.userID }));
    const isCorrect = yield user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    yield user.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: {
            userID: user._id,
            name: user.name,
            email: user.email
        } });
});
exports.updateUserPassword = updateUserPassword;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const user = (yield User_1.default.findOne({ _id: req.user.userID }));
    if (!password) {
        throw new errors_1.default.BadRequestError('Please provide password!');
    }
    const isCorrect = yield user.comparePassword(password);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Password');
    }
    yield user.deleteOne();
    res.clearCookie('token');
    // Delete Profile Picture
    const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('CREATIVE'));
    yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
    // Delete All Recipe Images
    yield (yield Recipe_1.default.find({ user: req.user.userID }).select('coverImage')).map(image => {
        const oldImage = image.coverImage.substring(image.coverImage.indexOf('CREATIVE'));
        return oldImage.substring(0, oldImage.lastIndexOf('.'));
    }).forEach(function (image) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cloudinary_1.v2.uploader.destroy(image);
        });
    });
    // Delete All Recipe Posts
    yield Recipe_1.default.deleteMany({ user: req.user.userID });
    // Delete ID off any Following or Followers
    const userIdToRemove = req.user.userID;
    const usersWithMyID = yield User_1.default.find({
        $or: [
            { following: userIdToRemove },
            { followers: userIdToRemove }
        ]
    });
    yield Promise.all(usersWithMyID.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.following.includes(userIdToRemove)) {
            user.following.pull(userIdToRemove);
        }
        if (user.followers.includes(userIdToRemove)) {
            user.followers.pull(userIdToRemove);
        }
        yield user.save();
    })));
    return res.status(http_status_codes_1.StatusCodes.OK).send();
});
exports.deleteAccount = deleteAccount;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.NotFoundError('You cant follow yourself.');
    }
    const user = (yield User_1.default.findOne({ _id: req.user.userID }));
    if (user.following.includes(id)) {
        throw new errors_1.default.BadRequestError('You are already following the user.');
    }
    const [findUser, findTargetUser] = yield Promise.all([
        User_1.default.findOneAndUpdate({ _id: req.user.userID }, { $addToSet: { following: id } }),
        User_1.default.findOneAndUpdate({ _id: id }, { $addToSet: { followers: req.user.userID } })
    ]);
    if (!findUser || !findTargetUser) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    const updatedUser = yield User_1.default.findOne({ _id: id }).populate('followers following');
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Successfully Followed Provided User!', user: updatedUser });
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id === req.user.userID) {
        throw new errors_1.default.NotFoundError('You cant follow yourself.');
    }
    const isFollowing = yield User_1.default.exists({ _id: req.user.userID, following: id });
    if (!isFollowing) {
        throw new errors_1.default.BadRequestError(`You cant unfollow someone you aren't followed to.`);
    }
    const [findUser, findTargetUser] = yield Promise.all([
        User_1.default.findOneAndUpdate({ _id: req.user.userID }, { $pull: { following: id } }),
        User_1.default.findOneAndUpdate({ _id: id }, { $pull: { followers: req.user.userID } })
    ]);
    if (!findUser || !findTargetUser) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    const updatedUser = yield User_1.default.findOne({ _id: id }).populate('followers following');
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Successfully Unfollowed Provided User!', user: updatedUser });
});
exports.unfollowUser = unfollowUser;
