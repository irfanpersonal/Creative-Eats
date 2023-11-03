import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice.js';
import allRecipesReducer from './features/allRecipes/allRecipesSlice.js';
import addRecipeReducer from './features/addRecipe/addRecipeSlice.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        allRecipes: allRecipesReducer,
        addRecipe: addRecipeReducer
    }
});

export default store;