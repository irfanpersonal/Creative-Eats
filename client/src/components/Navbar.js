import styled from 'styled-components';
import {NavLink, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../features/user/userSlice.js';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store => store.user);
    return (
        <Wrapper>
            <h1>Creative Eats</h1>
            <div>
                <NavLink to='/'>Home</NavLink>
                {user ? (
                    <>
                        <NavLink to='/add-recipe'>Add Recipe</NavLink>
                        <NavLink to='/profile'>Profile</NavLink>
                        <span onClick={() => {
                            dispatch(logoutUser());
                            navigate('/');
                        }}>Logout</span>
                    </>
                ) : (
                    <>
                        <NavLink to='/auth'>Login/Register</NavLink>
                    </>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    padding: 1rem;
    background-color: black;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
        color: white;
        margin-left: 1rem;
        text-decoration: none;
    }
    span {
        margin-left: 1rem;
        border: 1px solid black;
        padding: 0.10rem 1rem;
        background-color: rgb(0, 169, 255);
        cursor: pointer;
    }
    span:hover {
        border: 1px solid white;
    }
    .active {
        border-bottom: 3px solid white;
    }
`;

export default Navbar;