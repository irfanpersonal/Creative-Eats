import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {type IRecipe} from '../features/profile/profileSlice';
import {updateSingleRecipe} from '../features/singleRecipe/singleRecipeThunk';
import {useParams} from 'react-router-dom';
import {nanoid} from 'nanoid';

interface EditRecipeDataProps {
    singleRecipe: IRecipe
}

const EditRecipeData: React.FunctionComponent<EditRecipeDataProps> = ({singleRecipe}) => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {editSingleRecipeLoading} = useSelector((store: useSelectorType) => store.singleRecipe);
    const [instructions, setInstructions] = React.useState<string[]>(singleRecipe!.instructions);
    const [ingredients, setIngredients] = React.useState<string[]>(singleRecipe!.ingredients);
    const addInput = (type: string) => {
        if (type === 'instructions') {
            setInstructions([...instructions, '']);
        } else if (type === 'ingredients') {
            setIngredients([...ingredients, '']);
        }
    };
    const removeInput = (index: number, type: string) => {
        if (type === 'instructions') {
            const updatedInstructions = [...instructions];
            updatedInstructions.splice(index, 1);
            setInstructions(updatedInstructions);
        } else if (type === 'ingredients') {
            const updatedIngredients = [...ingredients];
            updatedIngredients.splice(index, 1);
            setIngredients(updatedIngredients);
        }
    };
    const handleInputChange = (index: number, type: string, event: React.ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value;
        if (type === 'instructions') {
            const updatedInstructions = [...instructions];
            updatedInstructions[index] = value;
            setInstructions(updatedInstructions);
        } else if (type === 'ingredients') {
            const updatedIngredients = [...ingredients];
            updatedIngredients[index] = value;
            setIngredients(updatedIngredients);
        }
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('budget', (target.elements.namedItem('budget') as HTMLInputElement).value);
        formData.append('category', (target.elements.namedItem('category') as HTMLSelectElement).value);
        const instructionValues = instructions.filter(value => value);
        const ingredientValues = ingredients.filter(value => value);
        console.log(instructionValues);
        console.log(ingredientValues);
        if (!instructionValues.length) {
            return;
        }
        else {
            instructionValues.map((instructionValue) => {
                formData.append('instructions', instructionValue);
            });
        }
        if (!ingredientValues.length) {
            return;
        }
        else {
            ingredientValues.map((ingredientValue) => {
                formData.append('ingredients', ingredientValue);
            });
        }
        if (target.coverImage.files[0]) {
            formData.append('coverImage', target.coverImage.files[0]);
        }
        dispatch(updateSingleRecipe({recipeID: id!, recipeData: formData}));
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" defaultValue={singleRecipe!.name}/>
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" defaultValue={singleRecipe!.description}></textarea>
            </div>
            <div>
                <label htmlFor="budget">Budget</label>
                <input id="budget" type="number" name="budget" defaultValue={singleRecipe!.budget}/>
            </div>
            <div>
                <label htmlFor="category">Category</label>
                <select id="category" name="category" defaultValue={singleRecipe!.category}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="dessert">Dessert</option>
                </select>
            </div>
            <div className="custom-message hide" style={{marginTop: '1rem', backgroundColor: 'lightblue', padding: '0.5rem'}}></div>
            <div className="instructions-box">
                <label id="instructions-label" htmlFor="instructions">Instructions <span className="option" onClick={() => addInput('instructions')}>+</span></label>
                {instructions.map((instruction, index) => (
                    <div key={index} style={{display: 'flex'}}>
                        <input style={{width: '75%'}} value={instruction} onChange={(event) => handleInputChange(index, 'instructions', event)}/>
                        <button type="button" style={{width: '25%', cursor: 'pointer', backgroundColor: 'lightcoral', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => {
                            if (document.querySelectorAll('.instructions-box input').length === 1) {
                                (document.querySelector('.custom-message') as HTMLDivElement).textContent = 'Note: You must have atleast 1 instruction or ingredient!';
                                if (!(document.querySelector('.custom-message') as HTMLDivElement).classList.contains('hide')) {
                                    return;
                                }
                                (document.querySelector('.custom-message') as HTMLDivElement).classList.toggle('hide');
                                return;
                            }
                            removeInput(index, 'instructions');
                        }}>X</button>
                    </div>
                ))}
            </div>
            <div className="ingredients-box">
                <label id="ingredients-label" htmlFor="ingredients">Ingredients <span className="option" onClick={() => addInput('ingredients')}>+</span></label>
                {ingredients.map((ingredient, index) => (
                    <div key={index} style={{display: 'flex'}}>
                        <input style={{width: '75%'}} value={ingredient} onChange={(event) => handleInputChange(index, 'ingredients', event)}/>
                        <button type="button" style={{width: '25%', cursor: 'pointer', backgroundColor: 'lightcoral', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => {
                            if (document.querySelectorAll('.ingredients-box input').length === 1) {
                                (document.querySelector('.custom-message') as HTMLDivElement).textContent = 'Note: You must have atleast 1 instruction or ingredient!';
                                if (!(document.querySelector('.custom-message') as HTMLDivElement).classList.contains('hide')) {
                                    return;
                                }
                                (document.querySelector('.custom-message') as HTMLDivElement).classList.toggle('hide');
                                return;
                            }
                            removeInput(index, 'ingredients');
                        }}>X</button>
                    </div>
                ))}
            </div>
            <div>
                <label htmlFor="coverImage">Cover Image</label>
                <input id="coverIamge" type="file" name="coverImage"/>
            </div>
            <button type="submit" disabled={editSingleRecipeLoading}>{editSingleRecipeLoading ? 'EDITING RECIPE' : 'EDIT RECIPE'}</button>
        </form>
    );
}

export default EditRecipeData;