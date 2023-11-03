import {createSlice} from '@reduxjs/toolkit';
import {getAllRecipes, deleteSingleRecipe} from './allRecipesThunk.js';
import {toast} from 'react-toastify';

const initialState = {
    isLoading: false,
    recipes: [],
    totalRecipes: '',
    numberOfPages: '',
    page: 1,
    search: '',
    sort: '-createdAt'
};

const allRecipes = createSlice({
    name: 'allRecipes',
    initialState,
    reducers: {
        updateSearchBoxValues: (state, action) => {
            state.page = 1;
            state[action.payload.name] = action.payload.value;
        },
        updatePage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllRecipes.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getAllRecipes.fulfilled, (state, action) => {
            state.isLoading = false;
            state.recipes = action.payload.recipes;
            state.totalRecipes = action.payload.totalRecipes;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllRecipes.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(deleteSingleRecipe.fulfilled, (state, action) => {
            toast.success('Deleted Recipe!');
        }).addCase(deleteSingleRecipe.rejected, (state, action) => {
            toast.error(action.payload);
        });
    }
});

export const {updateSearchBoxValues, updatePage} = allRecipes.actions;

export default allRecipes.reducer;