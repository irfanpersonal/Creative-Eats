import {useSelector} from "react-redux";
import RecipeListItem from "./RecipeListItem";

const RecipeList = ({data}) => {
    const {totalRecipes} = useSelector(store => store.allRecipes);
    if (!data.length) {
        return (
            <section>
                <h1 style={{textAlign: 'center', margin: '1rem 0'}}>No Recipes...</h1>
            </section>
        );
    }
    return (
        <section>
            <h1>{totalRecipes} Recipe{totalRecipes > 1 && 's'} Found...</h1>
            {data.map(item => {
                return <RecipeListItem key={item._id} data={item}/>
            })}
        </section>
    );
}

export default RecipeList;