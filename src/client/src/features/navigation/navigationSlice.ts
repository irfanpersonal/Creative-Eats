import {createSlice} from '@reduxjs/toolkit';
import {getCurrentPageLocation} from '../../utils';
import {addRecipe} from '../user/userThunk';
import {deleteSingleRecipe, getSingleRecipe} from '../singleRecipe/singleRecipeThunk';
import {getSingleProfileData} from '../singleProfile/singleProfileThunk';

interface INavigate {
    location: string
}

const initialState: INavigate = {
    location: getCurrentPageLocation()
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addRecipe.fulfilled, (state) => {
            state.location = state.location === '/profile' ? '/profile#' : '/profile';
        }).addCase(getSingleRecipe.rejected, (state) => {
            state.location = state.location === '/recipe' ? '/recipe#' : '/recipe';
        }).addCase(deleteSingleRecipe.fulfilled, (state) => {
            state.location = state.location === '/profile' ? '/profile#' : '/profile';
        }).addCase(getSingleProfileData.rejected, (state) => {
            state.location = state.location === '/' ? '/#' : '/';
        });
    }
});

export const {} = navigationSlice.actions;

export default navigationSlice.reducer;