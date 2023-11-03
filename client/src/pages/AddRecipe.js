import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {createRecipe, updateSingleRecipe} from '../features/addRecipe/addRecipeThunk';
import {isEditingFalse, resetEditRecipeValues, updateEditRecipeValues} from '../features/addRecipe/addRecipeSlice';

const AddRecipe = () => {
    const dispatch = useDispatch();
    const {isLoading, isEditing, editRecipeValues} = useSelector(store => store.addRecipe);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.elements.name.value);
        formData.append('description', event.target.elements.description.value);
        formData.append('ingredients', event.target.elements.ingredients.value);
        formData.append('instructions', event.target.elements.instructions.value);
        formData.append('foodImage', event.target.foodImage.files[0]);
        if (isEditing) {
            dispatch(updateSingleRecipe({recipeID: editRecipeValues.id, recipe: formData}));
            return;
        }
        dispatch(createRecipe(formData));
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <h1>{isEditing ? 'Edit Recipe' : 'Add Recipe'}</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" value={editRecipeValues.name} onChange={(event) => dispatch(updateEditRecipeValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={editRecipeValues.description} onChange={(event) => dispatch(updateEditRecipeValues({name: event.target.name, value: event.target.value}))}></textarea>
            </div>
            <div>
                <label htmlFor="ingredients">Ingredients</label>
                <textarea id="ingredients" name="ingredients" value={editRecipeValues.ingredients} onChange={(event) => dispatch(updateEditRecipeValues({name: event.target.name, value: event.target.value}))}></textarea>
            </div>
            <div>
                <label htmlFor="instructions">Instructions</label>
                <textarea id="instructions" name="instructions" value={editRecipeValues.instructions} onChange={(event) => dispatch(updateEditRecipeValues({name: event.target.name, value: event.target.value}))}></textarea>
            </div>
            <div>
                <label htmlFor="foodImage">Food Image</label>
                <input id="foodImage" type="file" name="foodImage"/>
                {isEditing && (
                    <p>Current Image: <img src={editRecipeValues.foodImage} alt="current image"/></p>
                )}
            </div>
            {isEditing && (
                <button type="button" onClick={() => {
                    dispatch(isEditingFalse());
                    dispatch(resetEditRecipeValues());
                }}>CLEAR</button>
            )}
            <button type="submit" disabled={isLoading}>{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    border: 1px solid black;
    width: 50%;
    margin: 0 auto;
    padding: 1rem;
    h1 {
        text-align: center;
        background-color: lightblue;
    }
    input {
        display: block;
        width: 100%;
        padding: 0.5rem;
    }
    label, button {
        display: block;
        margin-top: 1rem;
        width: 100%;
    }
    button {
        padding: 0.5rem;
    }
    #foodImage {
        padding: 0;
        width: 100%;
    }
    textarea {
        width: 100%;
        min-height: 100px;
    }
    p {
        margin-top: 1rem;
    }
    img {
        display: block;
        width: 100%;
        height: 10%;
    }
`;

export default AddRecipe;