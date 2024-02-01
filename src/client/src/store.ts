import {configureStore} from '@reduxjs/toolkit';
import navigationReducer from './features/navigation/navigationSlice';
import userReducer from './features/user/userSlice';
import profileReducer from './features/profile/profileSlice';
import settingsReducer from './features/settings/settingsSlice';
import singleRecipeReducer from './features/singleRecipe/singleRecipeSlice';
import allRecipesReducer from './features/allRecipes/allRecipesSlice';
import singleProfileReducer from './features/singleProfile/singleProfileSlice';
import searchReducer from './features/search/searchSlice';
import homeReducer from './features/home/homeSlice';

const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        user: userReducer,
        profile: profileReducer,
        settings: settingsReducer,
        singleRecipe: singleRecipeReducer,
        allRecipes: allRecipesReducer,
        singleProfile: singleProfileReducer,
        search: searchReducer,
        home: homeReducer
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;