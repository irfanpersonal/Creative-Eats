import {createAsyncThunk} from '@reduxjs/toolkit';
import customFetch from '../../utils';

export const registerUser = createAsyncThunk('user/registerUser', async(user, thunkAPI) => {
    try {
        const response = await customFetch.post('/auth/register', user);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async(user, thunkAPI) => {
    try {
        const response = await customFetch.post('/auth/login', user);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateUser = createAsyncThunk('user/updateUser', async(user, thunkAPI) => {
    try {
        const response = await customFetch.patch('/auth/updateUser', user);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});