import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const updateUserPassword = createAsyncThunk('settings/changePassword', async(input: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateUserPassword', input);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteAccount = createAsyncThunk('settings/deleteAccount', async(password: string, thunkAPI) => {
    try {
        const response = await axios.delete('/api/v1/user/deleteAccount', {
            data: {password}
        });
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});