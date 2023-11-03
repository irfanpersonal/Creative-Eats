import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AddRecipe, Auth, Error, Home, HomeLayout, Profile, ProtectedRoute, Recipe} from './pages';

import {loader as recipeLoader} from './pages/Recipe.js';

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
				path: 'profile',
				element: <ProtectedRoute><Profile/></ProtectedRoute>
			},
			{
				path: 'recipe/:id',
				element: <Recipe/>,
				loader: recipeLoader
			},
			{
				path: 'auth',
				element: <Auth/>
			}
		]
	}
]);

const App = () => {
	return (
		<RouterProvider router={router}/>
	);
}

export default App;