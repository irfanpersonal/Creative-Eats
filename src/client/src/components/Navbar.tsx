import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {resetEverything} from '../features/home/homeSlice';

const Navbar: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper>
            <h1 className="title">Creative Eats</h1>
            <div className="link-container">
                <NavLink to='/' onClick={() => dispatch(resetEverything())}>Home</NavLink>
                <NavLink to='/search'>Search</NavLink>
                <NavLink to='/recipe'>Recipes</NavLink>
                {user && (
                    <>
                        <NavLink to='/add-recipe'>Add Recipe</NavLink>
                        <NavLink to='/profile'>Profile</NavLink>
                        <NavLink to='/settings'>Settings</NavLink>
                    </>
                )}
                {!user && (
                    <>
                        <NavLink to='/auth'>Register/Login</NavLink>
                    </>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    position: fixed;
    left: 0;
    top: 0;
    width: 25vw;
    height: 100vh;
    padding: 1rem;
    background-color: rgb(255, 187, 100);
    border-right: 1px solid black;
    .title {
        text-align: center;
        border-bottom: 1px solid black;
    }
    .link-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    a {
        text-decoration: none;
        color: black;
        padding: 0.5rem;
        outline: 1px solid black;
        margin-top: 0.5rem;
    }
    a:hover, a:active {
        background-color: rgb(255, 234, 167);
    }
    .active {
        background-color: rgb(255, 234, 167);
    }
`;

export default Navbar;