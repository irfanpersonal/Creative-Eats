import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getSingleProfileData = createAsyncThunk('singleProfile/getSingleProfileData', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${userID}`);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleProfileRecipes = createAsyncThunk('singleProfile/getSingleProfileRecipes', async(userID: string, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).singleProfile;
        const response = await axios.get(`/api/v1/recipe?username=${userID}&search=${searchBoxValues.search}&category=${searchBoxValues.category}&minimumBudget=${searchBoxValues.minimumBudget}&maximumBudget=${searchBoxValues.maximumBudget}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const followUser = createAsyncThunk('singleProfile/followUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/user/${userID}/followUser`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unfollowUser = createAsyncThunk('singleProfile/unfollowUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/user/${userID}/unfollowUser`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});