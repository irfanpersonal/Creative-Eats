import {createSlice} from '@reduxjs/toolkit';
import {deleteSingleRecipe, getSingleRecipe, updateSingleRecipe} from './singleRecipeThunk';
import {type IRecipe} from '../profile/profileSlice';
import {toast} from 'react-toastify';

interface ISingleRecipe {
    singleRecipeLoading: boolean,
    editSingleRecipeLoading: boolean,
    deleteSingleRecipeLoading: boolean,
    singleRecipe: IRecipe | null
}

const initialState: ISingleRecipe = {
    singleRecipeLoading: true,
    deleteSingleRecipeLoading: false,
    editSingleRecipeLoading: false,
    singleRecipe: null
};

const singleRecipeSlice = createSlice({
    name: 'singleRecipe',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(getSingleRecipe.pending, (state) => {
            state.singleRecipeLoading = true;
        }).addCase(getSingleRecipe.fulfilled, (state, action) => {
            state.singleRecipeLoading = false;
            state.singleRecipe = action.payload;
        }).addCase(getSingleRecipe.rejected, (state) => {
            state.singleRecipeLoading = true;
        }).addCase(deleteSingleRecipe.pending, (state) => {
            state.deleteSingleRecipeLoading = true;
        }).addCase(deleteSingleRecipe.fulfilled, (state) => {
            state.deleteSingleRecipeLoading = false;
            toast.success('Deleted Recipe!');
        }).addCase(deleteSingleRecipe.rejected, (state, action) => {
            state.deleteSingleRecipeLoading = false;
            toast.error(action.payload as string);
        }).addCase(updateSingleRecipe.pending, (state) => {
            state.editSingleRecipeLoading = true;
        }).addCase(updateSingleRecipe.fulfilled, (state, action) => {
            state.editSingleRecipeLoading = false;
            state.singleRecipe = action.payload;
            toast.success('Edited Recipe!');
        }).addCase(updateSingleRecipe.rejected, (state, action) => {
            state.editSingleRecipeLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {} = singleRecipeSlice.actions;

export default singleRecipeSlice.reducer;