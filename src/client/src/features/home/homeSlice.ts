import {createSlice} from '@reduxjs/toolkit';
import {IRecipe} from '../profile/profileSlice';
import {getUserFeed} from './homeThunk';

interface IHome {
    getUserFeedLoading: boolean,
    userFeed: IRecipe[],
    completeUserFeed: IRecipe[],
    totalRecipes: number | null,
    numberOfPages: number | null,
    page: number
}

const initialState: IHome = {
    getUserFeedLoading: true,
    userFeed: [],
    completeUserFeed: [],
    totalRecipes: null,
    numberOfPages: null,
    page: 1
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        resetEverything: (state) => {
            state.getUserFeedLoading = true;
            state.userFeed = [];
            state.completeUserFeed = [];
            state.totalRecipes = null;
            state.numberOfPages = null;
            state.page = 1;
        },
        resetPage: (state) => {
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateRecipes: (state, action) => {
            state.userFeed = [...state.userFeed, ...action.payload];
        }
    },
    extraReducers: (builder) => {
        // Tweak this now!
        builder.addCase(getUserFeed.pending, (state) => {
            state.getUserFeedLoading = true;
        }).addCase(getUserFeed.fulfilled, (state, action) => {
            state.getUserFeedLoading = false;
            state.userFeed = [];
            state.userFeed = action.payload.recipes;
            state.completeUserFeed = [...state.completeUserFeed, ...action.payload.recipes];
            state.totalRecipes = action.payload.totalRecipes;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getUserFeed.rejected, (state) => {
            state.getUserFeedLoading = false;
        });
    }
});

export const {resetPage, setPage, updateRecipes, resetEverything} = homeSlice.actions;

export default homeSlice.reducer;