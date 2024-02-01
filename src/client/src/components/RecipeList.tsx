import {type IRecipe} from "../features/profile/profileSlice";
import RecipeListItem from "./RecipeListItem";
import {nanoid} from 'nanoid';

interface RecipeListProps {
    data: IRecipe[],
    totalRecipes: number | null
}

const RecipeList: React.FunctionComponent<RecipeListProps> = ({data, totalRecipes}) => {
    return (
        <section>
            <h1 style={{marginTop: '0.5rem', borderBottom: '1px solid black'}}>{totalRecipes} Recipe{totalRecipes! > 1 && 's'} Found...</h1>
            {data.map(item => {
                return (
                    <RecipeListItem key={nanoid()} data={item}/>
                );
            })}
        </section>
    );
}

export default RecipeList;