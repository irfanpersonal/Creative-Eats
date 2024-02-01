"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recipeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide Recipe Name'],
        minlength: 5,
        maxLength: 40
    },
    description: {
        type: String,
        required: [true, 'Must Provide Recipe Description']
    },
    category: {
        type: String,
        required: [true, 'Must Provide Recipe Category'],
        enum: {
            values: ['breakfast', 'lunch', 'dinner', 'dessert'],
            message: '{VALUE} is not a supported post category!'
        }
    },
    ingredients: {
        type: [String],
        required: [true, 'Must Provide Recipe Ingredients']
    },
    budget: {
        type: Number,
        required: [true, 'Must Provide Recipe Budget']
    },
    instructions: {
        type: [String],
        required: [true, 'Must Provide Recipe Instructions']
    },
    coverImage: {
        type: String,
        required: [true, 'Must Provide Recipe Cover Image']
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Recipe User'],
        ref: 'User'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Recipe', recipeSchema);
