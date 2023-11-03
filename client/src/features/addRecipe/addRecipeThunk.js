import {createAsyncThunk} from '@reduxjs/toolkit';
import customFetch from '../../utils';

export const createRecipe = createAsyncThunk('addRecipe/createRecipe', async(recipe, thunkAPI) => {
    try {   
        const response = await customFetch.post('/recipe', recipe);
        const data = response.data;
        return data.recipe;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleRecipe = createAsyncThunk('addRecipe/getSingleRecipe', async(recipeID, thunkAPI) => {
    try {
        const response = await customFetch.get(`/recipe/${recipeID}`);
        const data = response.data;
        return data.recipe;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleRecipe = createAsyncThunk('addRecipe/updateSingleRecipe', async({recipeID, recipe}, thunkAPI) => {
    try {
        const response = await customFetch.patch(`/recipe/${recipeID}`, recipe);
        const data = response.data;
        return data.recipe;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});