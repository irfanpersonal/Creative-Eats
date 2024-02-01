import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AddRecipe, Auth, Error, Home, HomeLayout, Profile, ProtectedRoute, Recipe, Recipes, Search, Setting, SingleProfile} from './pages';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from './store';
import {showCurrentUser} from './features/user/userThunk';
import {Loading} from './components';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout/>,
		errorElement: <Error/>,
		children: [
			{
				index: true,
				element: <Home/>
			},
			{
				path: 'add-recipe',
				element: <ProtectedRoute><AddRecipe/></ProtectedRoute>
			},
			{
				path: 'recipe',
				element: <Recipes/>
			},
			{
				path: 'recipe/:id',
				element: <Recipe/>
			},
			{
				path: 'profile',
				element: <ProtectedRoute><Profile/></ProtectedRoute>
			},
			{
				path: 'profile/:id',
				element: <SingleProfile/>
			},
			{
				path: 'search',
				element: <Search/>
			},
			{
				path: 'settings',
				element: <ProtectedRoute><Setting/></ProtectedRoute>
			}
		]
	},
	{
		path: '/auth',
		element: <Auth/>,
		errorElement: <Error/>
	}
]);

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch<useDispatchType>();
	const {globalLoading} = useSelector((store: useSelectorType) => store.user);
	const {location} = useSelector((store: useSelectorType) => store.navigation);
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	React.useEffect(() => {
		if (window.location.pathname !== location) {
			router.navigate(location);
		}
	}, [location]);
	if (globalLoading) {
		return (
			<Loading title="Loading Application" position='center'/>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;