import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getSingleRecipe = createAsyncThunk('singleRecipe/getSingleRecipe', async(recipeID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/recipe/${recipeID}`);
        const data = response.data;
        return data.recipe;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleRecipe = createAsyncThunk('singleRecipe/updateSingleRecipe', async(inputData: {recipeID: string, recipeData: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/recipe/${inputData.recipeID}`, inputData.recipeData);
        const data = response.data;
        return data.recipe;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleRecipe = createAsyncThunk('singleRecipe/deleteSingleRecipe', async(recipeID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/recipe/${recipeID}`);
        const data = response.data;
        return data.recipe;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});