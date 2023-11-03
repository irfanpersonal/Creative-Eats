import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {updateSearchBoxValues} from '../features/allRecipes/allRecipesSlice';
import {getAllRecipes} from '../features/allRecipes/allRecipesThunk';

const SearchBox = () => {
    const dispatch = useDispatch();
    const {isLoading, search, sort} = useSelector(store => store.allRecipes);
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(getAllRecipes());
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="search">Search</label>
                    <input id="search" type="search" name="search" value={search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="sort">Sort</label>
                    <select id="sort" name="sort" value={sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                        <option value="-createdAt">Latest</option>
                        <option value="createdAt">Oldest</option>
                        <option value="name">A-Z</option>
                        <option value="-name">Z-A</option>
                    </select>
                </div>
                <div>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
                </div>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 50%;
        border: 1px solid black;
        padding: 1rem;
        border-radius: 1rem;
        background-color: rgb(247, 239, 229);
    }
    input, select, button {
        display: block;
        padding: 0.5rem;
        width: 100%;
    }
    input, select {
        margin: 1rem 0;
    }
    button {
        background-color: black;
        color: white;
        border: none;
    }
`;

export default SearchBox;