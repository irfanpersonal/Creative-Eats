import {useRouteError, Link} from 'react-router-dom';
import styled from 'styled-components';

const Error = () => {
    const error = useRouteError();
    if (error.status === 404) {
        return (
            <Wrapper>
                <h1>404 Page Not Found</h1>
                <p>Ooopsies! Looks like you don't know where your going. How about home?</p>
                <Link to='/'>Home</Link>
            </Wrapper>
        );
    }
    return (
        <h1>Something went wrong, try again later!</h1>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: lightcoral;
    h1, p, a {
        margin-bottom: 1rem;
    } 
    a {
        background-color: lightblue;
        padding: 0.5rem 2rem;
        border-radius: 1rem;
        text-decoration: none;
        color: black;
    }
    a:hover {
        border: 1px solid black;
    }
`;

export default Error;