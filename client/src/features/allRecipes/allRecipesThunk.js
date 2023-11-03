import {createAsyncThunk} from '@reduxjs/toolkit';
import customFetch from '../../utils';
import {logoutUser} from '../user/userSlice';
import {resetEditRecipeValues} from '../addRecipe/addRecipeSlice';

export const getAllRecipes = createAsyncThunk('allRecipes/getAllRecipes', async(_, thunkAPI) => {
    try {
        const {search, sort, page} = thunkAPI.getState().allRecipes;
        const response = await customFetch.get(`/recipe?search=${search}&sort=${sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleRecipe = createAsyncThunk('allRecipes/deleteSingleRecipe', async(recipeID, thunkAPI) => {
    try {
        const response = await customFetch.delete(`/recipe/${recipeID}`);
        const data = response.data;
        thunkAPI.dispatch(getAllRecipes());
        return data.recipe;
    }
    catch(error) {
        if (error.response.status === 401) {
            thunkAPI.dispatch(logoutUser());
            thunkAPI.dispatch(resetEditRecipeValues());
        }
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});