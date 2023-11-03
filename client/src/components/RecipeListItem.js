import styled from 'styled-components';
import {Link} from 'react-router-dom';

const RecipeListItem = ({data}) => {
    const {name, foodImage, _id: id} = data;
    return (
        <Link to={`/recipe/${id}`} style={{textDecoration: 'none'}}>
            <Wrapper>
                <img src={foodImage} alt={name}/>
                <div style={{backgroundColor: 'gray', padding: '1rem'}}>{name}</div>
            </Wrapper>
        </Link>
    );
}

const Wrapper = styled.article`
    img {
        width: 25%;
        height: 25%;
    }
    text-align: center;
    border: 1px solid black;
    padding: 1rem;
    margin: 1rem 0;
    background-color: rgb(247, 239, 229);
    color: black;
    div {
        margin: 1rem 0;
    }
`;

export default RecipeListItem;