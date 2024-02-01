import {createSlice} from '@reduxjs/toolkit';
import {getAllUsers} from './searchThunk';
import {type UserType} from '../user/userSlice';

interface ISearch {
    getAllUsersLoading: boolean,
    searchBoxValues: {
        search: string,
        sort: '' | 'a-z' | 'z-a',
    }
    page: number,
    users: UserType[],
    totalUsers: number | null,
    numberOfPages: number | null
}

const initialState: ISearch = {
    getAllUsersLoading: true,
    searchBoxValues: {
        search: '',
        sort: ''
    },
    page: 1,
    users: [],
    totalUsers: null,
    numberOfPages: null
};

const searchSlice = createSlice({
    name: 'search',
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
        builder.addCase(getAllUsers.pending, (state) => {
            state.getAllUsersLoading = true;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            state.getAllUsersLoading = false;
            state.users = action.payload.users;
            state.totalUsers = action.payload.totalUsers;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllUsers.rejected, (state) => {
            state.getAllUsersLoading = false;
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = searchSlice.actions;

export default searchSlice.reducer;