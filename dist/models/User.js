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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide User Name'],
        minLength: 5,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Must Provide User Email'],
        validate: {
            validator: (value) => {
                return validator_1.default.isEmail(value);
            },
            message: 'Invalid Email Address'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Must Provide User Password']
    },
    bio: {
        type: String,
        required: [true, 'Must Provide User Bio']
    },
    location: {
        type: String,
        required: [true, 'Must Provide User Location']
    },
    profilePicture: {
        type: String,
        required: [true, 'Must Provide User Profile Picture']
    },
    followers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    following: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
userSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return;
        }
        const randomBytes = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, randomBytes);
    });
});
userSchema.methods.comparePassword = function (guess) {
    return __awaiter(this, void 0, void 0, function* () {
        const isCorrect = yield bcrypt_1.default.compare(guess, this.password);
        return isCorrect;
    });
};
userSchema.virtual('recipes', {
    ref: 'Recipe',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});
exports.default = mongoose_1.default.model('User', userSchema);
