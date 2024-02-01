import {createSlice} from '@reduxjs/toolkit';
import {IRecipe} from '../profile/profileSlice';
import {getAllRecipes} from './allRecipesThunk';

interface IAllRecipes {
    getAllRecipesLoading: boolean,
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

const initialState: IAllRecipes = {
    getAllRecipesLoading: true,
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

const allRecipesSlice = createSlice({
    name: 'allRecipes',
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
        builder.addCase(getAllRecipes.pending, (state) => {
            state.getAllRecipesLoading = true;
        }).addCase(getAllRecipes.fulfilled, (state, action) => {
            state.getAllRecipesLoading = false;
            state.recipes = action.payload.recipes;
            state.totalRecipes = action.payload.totalRecipes;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllRecipes.rejected, (state) => {
            state.getAllRecipesLoading = false;
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = allRecipesSlice.actions;

export default allRecipesSlice.reducer;