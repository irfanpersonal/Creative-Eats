import {createAsyncThunk} from "@reduxjs/toolkit";
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getProfileData = createAsyncThunk('profile/getProfileData', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${userID}`);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateUser = createAsyncThunk('profile/updateUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateUser', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const logoutUser = createAsyncThunk('profile/logoutUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/auth/logout');
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getUserRecipes = createAsyncThunk('profile/getUserRecipes', async(userID: string, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).profile;
        const response = await axios.get(`/api/v1/recipe?username=${userID}&search=${searchBoxValues.search}&category=${searchBoxValues.category}&minimumBudget=${searchBoxValues.minimumBudget}&maximumBudget=${searchBoxValues.maximumBudget}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});