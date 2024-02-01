import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {type IRecipe} from "../features/profile/profileSlice";

interface RecipeListItemProps {
    data: IRecipe
}

const RecipeListItem: React.FunctionComponent<RecipeListItemProps> = ({data}) => {
    return (
        <Wrapper to={`/recipe/${data._id}`}>
            <article>
                <img style={{width: '6rem', height: '6rem', outline: '1px solid black', borderRadius: '50%'}} src={data.coverImage} alt={data.name}/>
                <h1 style={{borderBottom: '1px solid black'}}>{data.name}</h1>
                <h1>{data.category}</h1>
                <h1 style={{color: 'limegreen'}}>${data.budget}</h1>
            </article>
        </Wrapper>
    );
}

const Wrapper = styled(Link)`
    text-decoration: none;
    color: black;
    article {
        outline: 1px solid black;
        background-color: rgb(255, 234, 167);
        margin: 1rem 0;
        text-align: center;
    }
    article:hover {
        background-color: rgb(229, 225, 218);
    }
`;

export default RecipeListItem;