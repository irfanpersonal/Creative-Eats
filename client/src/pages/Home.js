import {useDispatch, useSelector} from 'react-redux';
import {SearchBox, RecipeList, PaginationBox} from '../components';
import {getAllRecipes} from '../features/allRecipes/allRecipesThunk';
import React from 'react';

const Home = () => {
    const dispatch = useDispatch();
    const {isLoading, recipes, totalRecipes} = useSelector(store => store.allRecipes);
    React.useEffect(() => {
        dispatch(getAllRecipes());
    }, []);
    return (
        <>
            <SearchBox/>
            {isLoading ? (
                <h1 style={{textAlign: 'center', margin: '1rem 0'}}>Loading...</h1>
            ) : (
                <RecipeList data={recipes}/>
            )}
            {totalRecipes > 10 && <PaginationBox method={getAllRecipes}/>}
        </>
    );
}

export default Home;