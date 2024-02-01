"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const recipe_1 = require("../controllers/recipe");
const authentication_1 = __importDefault(require("../middleware/authentication"));
router.route('/').get(recipe_1.getAllRecipes).post(authentication_1.default, recipe_1.createRecipe);
router.route('/getUserFeed').get(authentication_1.default, recipe_1.getUserFeed);
router.route('/:id').get(recipe_1.getSingleRecipe).patch(authentication_1.default, recipe_1.updateSingleRecipe).delete(authentication_1.default, recipe_1.deleteSingleRecipe);
exports.default = router;
