const express = require('express');
const router = express.Router();

const {getAllRecipes, getUserSpecificRecipes, createRecipe, getSingleRecipe, updateSingleRecipe, deleteSingleRecipe} = require('../controllers/recipe.js');
const authenticationMiddleware = require('../middleware/authentication.js');
const testUserMiddleware = require('../middleware/testUser.js');

router.route('/').get(getAllRecipes).post(authenticationMiddleware, testUserMiddleware, createRecipe);
router.route('/:id').get(getSingleRecipe).patch(authenticationMiddleware, testUserMiddleware, updateSingleRecipe).delete(authenticationMiddleware, testUserMiddleware, deleteSingleRecipe);

module.exports = router;