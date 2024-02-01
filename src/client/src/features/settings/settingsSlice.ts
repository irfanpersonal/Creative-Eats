import {createSlice} from '@reduxjs/toolkit';
import {updateUserPassword, deleteAccount} from './settingsThunk';
import {toast} from 'react-toastify';

interface ISettings {
    updateUserPasswordLoading: boolean,
    deleteAccountLoading: boolean
}

const initialState: ISettings = {
    updateUserPasswordLoading: false,
    deleteAccountLoading: false
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(updateUserPassword.pending, (state) => {
            state.updateUserPasswordLoading = true;
        }).addCase(updateUserPassword.fulfilled, (state) => {
            state.updateUserPasswordLoading = false;
            toast.success('Successfully Updated User Password!');
        }).addCase(updateUserPassword.rejected, (state, action) => {
            state.updateUserPasswordLoading = false;
            toast.error(action.payload as string);
        }).addCase(deleteAccount.pending, (state) => {
            state.deleteAccountLoading = true;
        }).addCase(deleteAccount.fulfilled, (state) => {
            state.deleteAccountLoading = false;
            toast.success('Successfully Deleted Account!');
        }).addCase(deleteAccount.rejected, (state, action) => {
            state.deleteAccountLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {} = settingsSlice.actions;

export default settingsSlice.reducer;