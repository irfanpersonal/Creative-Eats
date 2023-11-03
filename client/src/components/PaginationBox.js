import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {updatePage} from '../features/allRecipes/allRecipesSlice';
import {getAllRecipes} from '../features/allRecipes/allRecipesThunk';

const PaginationBox = () => {
    const dispatch = useDispatch();
    const {numberOfPages, page} = useSelector(store => store.allRecipes);
    return (
        <Wrapper>
            {Array.from({length: numberOfPages}, (value, index) => {
                return (
                    <span onClick={() => {
                        dispatch(updatePage(index + 1));
                        dispatch(getAllRecipes());
                    }} style={{border: page === index + 1 && '1px solid red'}} key={index}>{index + 1}</span>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    text-align: center;
    span {
        display: inline-block;
        background-color: lightgray;
        padding: 1rem;
        margin: 1rem 0;
        border: 1px solid black;
    }
`;

export default PaginationBox;