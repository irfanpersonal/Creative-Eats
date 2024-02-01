import {createSlice} from "@reduxjs/toolkit";
import {registerUser, loginUser, showCurrentUser, addRecipe} from "./userThunk";
import {toast} from 'react-toastify';
import {logoutUser} from "../profile/profileThunk";
import {deleteAccount} from "../settings/settingsThunk";

export type UserType = {_id: string, name: string, email: string, profilePicture: string, bio: string, location: string, createdAt: string, followers: UserType[], following: UserType[]}

interface IUser {
    globalLoading: boolean,
    authLoading: boolean,
    addRecipeLoading: boolean,
    user: {userID: string, name: string, email: string} | null,
    wantsToRegister: boolean
}

const initialState: IUser = {
    globalLoading: true,
    authLoading: false,
    addRecipeLoading: false,
    user: null,
    wantsToRegister: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.wantsToRegister = !state.wantsToRegister;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.authLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(loginUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(showCurrentUser.pending, (state) => {
            state.globalLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.globalLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state, action) => {
            state.globalLoading = false;
        }).addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
        }).addCase(deleteAccount.fulfilled, (state) => {
            state.user = null;
        }).addCase(addRecipe.pending, (state) => {
            state.addRecipeLoading = true;
        }).addCase(addRecipe.fulfilled, (state, action) => {
            state.addRecipeLoading = false;
            toast.success('Added Recipe!');
        }).addCase(addRecipe.rejected, (state, action) => {
            state.addRecipeLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {toggleAuthType} = userSlice.actions;

export default userSlice.reducer;