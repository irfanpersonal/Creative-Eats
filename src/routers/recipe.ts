import express from 'express';
const router = express.Router();

import {getAllRecipes, createRecipe, getSingleRecipe, updateSingleRecipe, deleteSingleRecipe, getUserFeed} from '../controllers/recipe';
import authenticationMiddleware from '../middleware/authentication';

router.route('/').get(getAllRecipes).post(authenticationMiddleware, createRecipe);
router.route('/getUserFeed').get(authenticationMiddleware, getUserFeed);
router.route('/:id').get(getSingleRecipe).patch(authenticationMiddleware, updateSingleRecipe).delete(authenticationMiddleware, deleteSingleRecipe);

export default router;