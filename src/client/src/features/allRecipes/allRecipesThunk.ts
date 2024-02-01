import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getAllRecipes = createAsyncThunk('allRecipes/getAllRecipes', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).allRecipes;
        const response = await axios.get(`/api/v1/recipe?search=${searchBoxValues.search}&category=${searchBoxValues.category}&minimumBudget=${searchBoxValues.minimumBudget}&maximumBudget=${searchBoxValues.maximumBudget}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});