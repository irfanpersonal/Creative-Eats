import {createSlice} from '@reduxjs/toolkit';
import {addUserFromLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage} from '../../utils';
import {registerUser, loginUser, updateUser} from './userThunk.js';
import {toast} from 'react-toastify';

const initialState = {
    isLoading: false,
    user: getUserFromLocalStorage()
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state, action) => {
            state.user = null;
            removeUserFromLocalStorage();
            toast.success('Logged Out!');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            addUserFromLocalStorage(action.payload);
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(loginUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            addUserFromLocalStorage(action.payload);
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(updateUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            addUserFromLocalStorage(action.payload);
            toast.success('Updated User!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        });
    }
});

export const {logoutUser} = userSlice.actions;

export default userSlice.reducer;