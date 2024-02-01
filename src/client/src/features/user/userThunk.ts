import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const registerUser = createAsyncThunk('user/registerUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/register', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/login', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const showCurrentUser = createAsyncThunk('user/showCurrentUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/showCurrentUser');
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const addRecipe = createAsyncThunk('user/addRecipe', async(recipeData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/recipe', recipeData);
        const data = response.data;
        return data.recipe;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});