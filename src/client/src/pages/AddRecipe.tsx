import React from 'react';
import styled from 'styled-components';
import {addRecipe} from '../features/user/userThunk';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';

const AddRecipe: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {addRecipeLoading} = useSelector((store: useSelectorType) => store.user);
    const addInstructionsInput = () => {
        const newElementsHTML = `
            <div style="display: flex;">
                <input style="width: 75%;">
                <button style="width: 25%; cursor: pointer; background-color: lightcoral; border: 1px solid black; display: flex; justify-content: center; align-items: center;" padding: 0; onclick="this.parentNode.remove()">X</button>
            </div>
        `;
        document.querySelector('.instructions-box')!.insertAdjacentHTML('beforeend', newElementsHTML);
    }
    const addIngredientsInput = () => {
        const newElementsHTML = `
            <div style="display: flex;">
                <input style="width: 75%;">
                <button style="width: 25%; cursor: pointer; background-color: lightcoral; border: 1px solid black; display: flex; justify-content: center; align-items: center;" padding: 0; onclick="this.parentNode.remove()">X</button>
            </div>
        `;
        document.querySelector('.ingredients-box')!.insertAdjacentHTML('beforeend', newElementsHTML);
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const instructions = (Array.from(document.querySelectorAll('.instructions-box input')) as HTMLInputElement[]).map(inputElement => inputElement.value).filter(value => value);
        const ingredients = (Array.from(document.querySelectorAll('.ingredients-box input')) as HTMLInputElement[]).map(inputElement => inputElement.value).filter(value => value);
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('budget', (target.elements.namedItem('budget') as HTMLInputElement).value);
        formData.append('category', (target.elements.namedItem('category') as HTMLSelectElement).value);
        instructions.map((_, index) => {
            formData.append('instructions', instructions[index]);
        });
        ingredients.map((_, index) => {
            formData.append('ingredients', ingredients[index]);
        });
        if (target.coverImage.files[0]) {
            formData.append('coverImage', target.coverImage.files[0]);
        }
        dispatch(addRecipe(formData));
    }
    return (
        <Wrapper>
            <h1 className="title">Add Recipe</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name"/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description"></textarea>
                </div>
                <div>
                    <label htmlFor="budget">Budget</label>
                    <input id="budget" type="number" name="budget"/>
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category">
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="dessert">Dessert</option>
                    </select>
                </div>
                <div className="instructions-box">
                    <label id="instructions-label" htmlFor="instructions">Instructions <span onClick={addInstructionsInput}>+</span></label>
                </div>
                <div className="ingredients-box">
                    <label id="ingredients-label" htmlFor="ingredients">Ingredients <span onClick={addIngredientsInput}>+</span></label>
                </div>
                <div>
                    <label htmlFor="coverImage">Cover Image</label>
                    <input id="coverIamge" type="file" name="coverImage"/>
                </div>
                <button type="submit" disabled={addRecipeLoading}>{addRecipeLoading ? 'CREATING RECIPE' : 'CREATE RECIPE'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    form {
        padding: 1rem;
        background-color: rgb(255, 234, 167);
        border-radius: 0.25rem;
        margin: 0 auto;
        margin-top: 1rem;
    }
    h1 {
        text-align: center;
        border-bottom: 1px solid black;
    }
    label, input, textarea, p, button {
        display: block;
        margin-top: 0.5rem;
        resize: none;
    }
    input[type="file"] {
        margin-top: 0.5rem;
        border: 1px solid black;
        padding: 0.5rem;
    }
    textarea {
        height: 100px;  
    }
    input, textarea, button, select {
        padding: 0.5rem;
        width: 100%;
    }
    p {
        cursor: pointer;
        text-align: center;
    }
    p:hover {
        color: gray;
    }
    span {
        background-color: lightgray;
        padding: 0 0.5rem;
        border: 1px solid black;
        cursor: pointer;
    }
`;

export default AddRecipe;