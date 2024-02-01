import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';
import {followUser, unfollowUser, getSingleProfileData, getSingleProfileRecipes} from './singleProfileThunk';
import {type IRecipe} from '../profile/profileSlice';
import {toast} from 'react-toastify';

interface ISingleProfile {
    singleProfileDataLoading: boolean,
    singleProfileData: UserType | null
    singleProfileRecipesLoading: boolean,
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
    numberOfPages: number | null,
    followUserLoading: boolean,
    unfollowUserLoading: boolean
}

const initialState: ISingleProfile = {
    singleProfileDataLoading: true,
    singleProfileData: null,
    singleProfileRecipesLoading: true,
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
    numberOfPages: null,
    followUserLoading: false,
    unfollowUserLoading: false
};

const singleProfileSlice = createSlice({
    name: 'singleProfile',
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
        builder.addCase(getSingleProfileData.pending, (state) => {
            state.singleProfileDataLoading = true;
        }).addCase(getSingleProfileData.fulfilled, (state, action) => {
            state.singleProfileDataLoading = false;
            state.singleProfileData = action.payload;
        }).addCase(getSingleProfileData.rejected, (state) => {
            state.singleProfileDataLoading = true;
        }).addCase(getSingleProfileRecipes.pending, (state) => {
            state.singleProfileRecipesLoading = true;
        }).addCase(getSingleProfileRecipes.fulfilled, (state, action) => {
            state.singleProfileRecipesLoading = false;
            state.recipes = action.payload.recipes;
            state.totalRecipes = action.payload.totalRecipes;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getSingleProfileRecipes.rejected, (state) => {
            state.singleProfileRecipesLoading = false;
        }).addCase(followUser.pending, (state) => {
            state.followUserLoading = true;
        }).addCase(followUser.fulfilled, (state, action) => {
            state.followUserLoading = false;
            state.singleProfileData!.followers = action.payload.user.followers;
            state.singleProfileData!.following = action.payload.user.following;
        }).addCase(followUser.rejected, (state, action) => {
            state.followUserLoading = false;
            toast.error(action.payload as string);
        }).addCase(unfollowUser.pending, (state) => {
            state.unfollowUserLoading = true;
        }).addCase(unfollowUser.fulfilled, (state, action) => {
            state.unfollowUserLoading = false;
            state.singleProfileData!.followers = action.payload.user.followers;
            state.singleProfileData!.following = action.payload.user.following;
        }).addCase(unfollowUser.rejected, (state, action) => {
            state.unfollowUserLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = singleProfileSlice.actions;

export default singleProfileSlice.reducer;