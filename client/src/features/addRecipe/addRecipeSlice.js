import {createSlice} from '@reduxjs/toolkit';
import {createRecipe, getSingleRecipe, updateSingleRecipe} from './addRecipeThunk';
import {toast} from 'react-toastify';

const initialState = {
    isLoading: false,
    isEditing: false,
    editRecipeValues: {
        name: '',
        description: '',
        ingredients: '',
        instructions: '',
        foodImage: '',
        id: ''
    }
};

const addRecipeSlice = createSlice({
    name: 'addRecipe',
    initialState,
    reducers: {
        isEditingTrue: (state, action) => {
            state.isEditing = true;
        },
        isEditingFalse: (state, action) => {
            state.isEditing = false;
        },
        resetEditRecipeValues: (state, action) => {
            state.editRecipeValues = {
                name: '',
                description: '',
                ingredients: '',
                instructions: '',
                foodImage: '',
                id: ''
            };
        },
        updateEditRecipeValues: (state, action) => {
            state.editRecipeValues[action.payload.name] = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createRecipe.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(createRecipe.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Created Recipe!');
        }).addCase(createRecipe.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(getSingleRecipe.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getSingleRecipe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.editRecipeValues.name = action.payload.name;
            state.editRecipeValues.description = action.payload.description;
            state.editRecipeValues.ingredients = action.payload.ingredients;
            state.editRecipeValues.instructions = action.payload.instructions;
            state.editRecipeValues.foodImage = action.payload.foodImage;
            state.editRecipeValues.id = action.payload._id;
        }).addCase(getSingleRecipe.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(updateSingleRecipe.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(updateSingleRecipe.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Edited Recipe!');
        }).addCase(updateSingleRecipe.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
    }
});

export const {isEditingTrue, isEditingFalse, resetEditRecipeValues, updateEditRecipeValues} = addRecipeSlice.actions;

export default addRecipeSlice.reducer;