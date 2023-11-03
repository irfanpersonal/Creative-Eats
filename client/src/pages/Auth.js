import styled from 'styled-components';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser, loginUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLoading, user} = useSelector(store => store.user);
    const [input, setInput] = React.useState({
        name: '',
        email: '',
        password: '',
        wantsToRegister: true
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.wantsToRegister) {
            dispatch(registerUser(input));
        }
        dispatch(loginUser({email: input.email, password: input.password}));
    }
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const toggleAuthType = () => {
        setInput(currentState => {
            return {...currentState, wantsToRegister: !input.wantsToRegister};
        });
    }
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>{input.wantsToRegister ? 'Register' : 'Login'}</h1>
                {input.wantsToRegister && (
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" name="name" value={input.name} onChange={handleChange}/>
                    </div>
                )}
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" name="email" value={input.email} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" value={input.password} onChange={handleChange}/>
                </div>
                <p style={{textAlign: 'center'}}>{input.wantsToRegister ? 'Already have an account?' : `Don't have an account?`} <span onClick={toggleAuthType}>{input.wantsToRegister ? 'Login' : 'Register'}</span></p>
                <button disabled={isLoading}>{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content:center;
    align-items: center;
    h1 {
        text-align: center;
        background-color: lightblue;
    }
    form {
        border: 1px solid black;
        padding: 1rem;
        width: 50%;
    }
    label, p {
        margin-top: 1rem;
    }
    label, input {
        display: block;
    }
    input, button {
        width: 100%;
        padding: 0.5rem;
    }
    button {
        margin-top: 1rem;
    }
    span {
        background-color: rgb(134, 167, 137);
        padding: 0.25rem 1.5rem;
        border-radius: 1rem;
        cursor: pointer;
    }
`;

export default Auth;