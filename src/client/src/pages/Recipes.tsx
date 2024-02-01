import React from 'react';
import styled from 'styled-components';
import {Loading, SearchBox, RecipeList, PaginationBox} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getAllRecipes} from '../features/allRecipes/allRecipesThunk';
import {updateSearchBoxValues, setPage} from '../features/allRecipes/allRecipesSlice';

const Recipes: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {searchBoxValues, recipes, getAllRecipesLoading, totalRecipes, numberOfPages, page} = useSelector((store: useSelectorType) => store.allRecipes);
    React.useEffect(() => {
        dispatch(getAllRecipes());
    }, []);
    return (
        <Wrapper>
            <SearchBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} setPage={setPage} updateSearch={getAllRecipes}/>
            {getAllRecipesLoading ? (
                <Loading title='Loading All Recipes' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <RecipeList data={recipes} totalRecipes={totalRecipes}/>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getAllRecipes}/>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`

`;

export default Recipes;