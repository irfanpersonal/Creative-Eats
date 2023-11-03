import {redirect, useLoaderData, useNavigate} from 'react-router-dom';
import customFetch from '../utils';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {PiNewspaperDuotone} from 'react-icons/pi';
import {GiCancel} from 'react-icons/gi';
import {isEditingTrue} from '../features/addRecipe/addRecipeSlice';
import {getSingleRecipe} from '../features/addRecipe/addRecipeThunk';
import {deleteSingleRecipe} from '../features/allRecipes/allRecipesThunk';

export const loader = async({context, params, request}) => {
    try {
        const {id} = params;
        const response = await customFetch.get(`/recipe/${id}`);
        const data = response.data;
        return data.recipe;
    }
    catch(error) {
        return redirect('/');
    }
}

const Recipe = () => {
    const data = useLoaderData();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {name, instructions, ingredients, description, foodImage, _id: id, createdAt, createdBy} = data;
    const fixedPublishTime = moment(createdAt).format('MMMM Do YYYY, h:mm:ss a');
    const {user} = useSelector(store => store.user);
    return (
        <Wrapper>
            <img src={foodImage} alt={name}/>
            {(createdBy.name === user?.name) && (
                <>
                    <Link to='/add-recipe' onClick={() => {
                        dispatch(isEditingTrue());
                        dispatch(getSingleRecipe(id));
                    }}>Edit Recipe <PiNewspaperDuotone/></Link>
                    <button to='/add-recipe' onClick={() => {
                        dispatch(deleteSingleRecipe(id));
                        navigate('/');
                    }}>Delete Recipe <GiCancel/></button>
                </>
            )}
            <div>by: {createdBy.name}</div>
            <div>Published At: {fixedPublishTime}</div>
            <div style={{backgroundColor: 'gray', padding: '1rem'}}>{name}</div>
            <div>Instructions: {instructions}</div>
            <div>Ingredients: {ingredients}</div>
            <div>Description: {description}</div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    img {
        width: 25%;
        height: 25%;
    }
    text-align: center;
    div, img {
        margin: 1rem 0;
    }
    a {
        display: block;
        text-decoration: none;
        color: black;
        width: 10%;
        margin: 0 auto;
        background-color: gray;
        margin-bottom: 1rem;
    }
`;

export default Recipe;