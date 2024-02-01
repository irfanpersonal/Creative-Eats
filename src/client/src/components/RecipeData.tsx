import {type IRecipe} from "../features/profile/profileSlice";
import {nanoid} from 'nanoid';
import {Link} from 'react-router-dom';
import moment from 'moment';

interface RecipeDataProps {
    singleRecipe: IRecipe
}

const RecipeData: React.FunctionComponent<RecipeDataProps> = ({singleRecipe}) => {
    return (
        <div>
            <img src={singleRecipe!.coverImage}/>
            <Link style={{display: 'block', textAlign: 'center', marginTop: '1rem', color: 'black'}} to={`/profile/${singleRecipe!.user._id}`}>Recipe Created By: {singleRecipe!.user.name}</Link>
            <div className="info">
                <p><span>Name:</span>{singleRecipe!.name}</p>
                <p><span>Category:</span>{singleRecipe!.category.toUpperCase()}</p>
                <p><span>Budget:</span>${singleRecipe!.budget}</p>
                <p><span>Description:</span>{singleRecipe!.description}</p>
                <p className="center">Instructions</p>
                <ul>
                    {singleRecipe!.instructions.map(item => {
                        return (
                            <li key={nanoid()}>{item}</li>
                        );
                    })}
                </ul>
                <p className="center">Ingredients</p>
                <ul>
                    {singleRecipe!.ingredients.map(item => {
                        return (
                            <li key={nanoid()}>{item}</li>
                        );
                    })}
                </ul>
                <div style={{textAlign: 'center', textDecoration: 'underline'}}>Created At: {moment(singleRecipe!.createdAt).format('MMMM Do YYYY')}</div>
            </div>
        </div>
    );
}

export default RecipeData;