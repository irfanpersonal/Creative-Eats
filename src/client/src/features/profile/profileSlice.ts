import {createSlice} from "@reduxjs/toolkit";
import {getProfileData, updateUser, logoutUser, getUserRecipes} from "./profileThunk";
import {UserType} from "../user/userSlice";
import {toast} from 'react-toastify';

export interface IRecipe {_id: string, name: string, description: string, category: 'breakfast' | 'lunch' | 'dinner' | 'dessert', ingredients: string[], budget: number, instructions: string[], coverImage: string, user: UserType, createdAt: string};

interface IProfile {
    profileDataLoading: boolean,
    editUserLoading: boolean,
    logoutLoading: boolean,
    profileData: UserType | null,
    myRecipesLoading: boolean,
    searchBoxValues: {
        search: string,
        category: '' | 'breakfast' | 'lunch' | 'dinner' | 'dessert',
        minimumBudget: string,
        maximumBudget: string,
        sort: '' | 'a-z' | 'z-a',
    }
    page: number,
    recipes: IRecipe[],
    totalRecipes: number | null,
    numberOfPages: number | null
}

const initialState: IProfile = {
    profileDataLoading: true,
    editUserLoading: false,
    logoutLoading: false,
    profileData: null,
    myRecipesLoading: true,
    searchBoxValues: {
        search: '',
        category: '',
        minimumBudget: '',
        maximumBudget: '',
        sort: '',
    },
    page: 1,
    recipes: [],
    totalRecipes: null,
    numberOfPages: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        resetPage: (state) => {
            state.page = 1;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.pending, (state) => {
            state.logoutLoading = true;
        }).addCase(logoutUser.fulfilled, (state) => {
            state.logoutLoading = false;
            toast.success('Successfully Logged Out!');
        }).addCase(logoutUser.rejected, (state) => {
            state.logoutLoading = false;
        }).addCase(getProfileData.pending, (state) => {
            state.profileDataLoading = true;
        }).addCase(getProfileData.fulfilled, (state, action) => {
            state.profileDataLoading = false;
            state.profileData = action.payload;
        }).addCase(getProfileData.rejected, (state) => {
            state.profileDataLoading = false;
        }).addCase(updateUser.pending, (state) => {
            state.editUserLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.editUserLoading = false;
            state.profileData = action.payload;
            toast.success('Edited User!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.editUserLoading = false;
            toast.error(action.payload as string);
        }).addCase(getUserRecipes.pending, (state) => {
            state.myRecipesLoading = true;
        }).addCase(getUserRecipes.fulfilled, (state, action) => {
            state.myRecipesLoading = false;
            state.recipes = action.payload.recipes;
            state.totalRecipes = action.payload.totalRecipes;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getUserRecipes.rejected, (state) => {
            state.myRecipesLoading = false;
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = profileSlice.actions;

export default profileSlice.reducer;