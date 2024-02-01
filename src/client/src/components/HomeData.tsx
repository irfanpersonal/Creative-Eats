import {Link} from 'react-router-dom';

const HomeData: React.FunctionComponent = () => {
    return (
        <>
            <h1 style={{textAlign: 'center', color: 'white', backgroundColor: 'black'}}>Home</h1>
            <h2 style={{marginTop: '1rem', textAlign: 'center'}}>Get Stared</h2>
            <ul style={{listStyle: 'none', backgroundColor: 'rgb(254, 234, 167)', padding: '0.5rem', outline: '1px solid black', textAlign: 'center'}}>
                <li>Create an account by visiting the <Link to='/auth'>auth</Link> page.</li>
                <li>Once logged in, explore the world of culinary delights on the <Link to='/recipe'>recipe</Link> page.</li>
                <li>Discover your favorite dishes by using the search box, considering factors like budget and category.</li>
                <li>If a recipe captures your taste buds, show your appreciation by following the author.</li>
                <li>Contribute your own culinary creations by navigating to the <Link to='/add-recipe'>add recipe</Link> page.</li>
                <li>Stay in control of your experience by checking and updating preferences on the <Link to='/profile'>profile</Link> page.</li>
            </ul>
            <h2 style={{marginTop: '1rem', textAlign: 'center'}}>Food Ideas</h2>
            <ul style={{listStyle: 'none', backgroundColor: 'rgb(254, 234, 167)', padding: '0.5rem', outline: '1px solid black', textAlign: 'center'}}>
                <li>Fried Chicken</li>
                <li>Pizza</li>
                <li>Burrito</li>
                <li>Pancake</li>
                <li>Mango Icecream</li>
                <li>Chicken Sandwich</li>
                <li>Lamb Chops</li>
            </ul>
        </>
    );
}

export default HomeData;