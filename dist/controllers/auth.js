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
exports.logout = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const index_1 = require("../utils/index");
const errors_1 = __importDefault(require("../errors"));
const cloudinary_1 = require("cloudinary");
const node_fs_1 = __importDefault(require("node:fs"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.profilePicture)) {
        throw new errors_1.default.BadRequestError('Please provide a profile picture!');
    }
    const profilePicture = req.files.profilePicture;
    if (!profilePicture.mimetype.startsWith('image')) {
        throw new errors_1.default.BadRequestError('File Type Must be Image!');
    }
    if (profilePicture.size > 1000000 * 2) {
        throw new errors_1.default.BadRequestError('Image Size cannot exceed 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + name + '_' + 'profile' + '_' + profilePicture.name;
    req.body.profilePicture = 'SETTING A VALUE FOR NOW SO I CAN SATISFY MONGOOSE';
    const user = yield User_1.default.create(req.body);
    const result = yield cloudinary_1.v2.uploader.upload(profilePicture.tempFilePath, {
        public_id: uniqueIdentifier,
        folder: 'CREATIVE-EATS/PROFILE_IMAGES'
    });
    user.profilePicture = result.secure_url;
    yield user.save();
    yield node_fs_1.default.unlink(profilePicture.tempFilePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    const token = (0, index_1.createToken)(user);
    (0, index_1.createCookieWithToken)(res, token);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: {
            userID: user._id,
            name: user.name,
            email: user.email
        } });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.default.BadRequestError('Please provide email and password!');
    }
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the Email Provided!');
    }
    const isCorrect = yield user.comparePassword(password);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Password!');
    }
    const token = (0, index_1.createToken)(user);
    (0, index_1.createCookieWithToken)(res, token);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: {
            userID: user._id,
            name: user.name,
            email: user.email
        } });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Successfully Logged Out!' });
});
exports.logout = logout;
