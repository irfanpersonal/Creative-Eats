import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useNavigate} from 'react-router-dom';
import {toggleAuthType} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {RegisterBox, LoginBox} from '../components';

const Auth: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {wantsToRegister, authLoading, user} = useSelector((store: useSelectorType) => store.user);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        const target = event.target as HTMLFormElement;
        if (wantsToRegister) {
            formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
            formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
            formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
            formData.append('profilePicture', target.profilePicture.files[0]);
            formData.append('bio', (target.elements.namedItem('bio') as HTMLInputElement).value);
            formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
        dispatch(loginUser(formData));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>{wantsToRegister ? 'Register' : 'Login'}</h1>
                {wantsToRegister ? (
                    <RegisterBox/>
                ) : (
                    <LoginBox/>
                )}
                <p onClick={() => dispatch(toggleAuthType())}>{wantsToRegister ? 'Have an account?' : `Don't have an account`}</p>
                <button type="submit" disabled={authLoading}>{authLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
    form {
        width: 50%;
        padding: 1rem;
        background-color: rgb(255, 234, 167);
        border-radius: 0.25rem;
    }
    h1 {
        text-align: center;
        border-bottom: 1px solid black;
    }
    label, input, textarea, p, button {
        display: block;
        margin-top: 0.5rem;
        resize: none;
    }
    input[type="file"] {
        margin-top: 0.5rem;
        border: 1px solid black;
        padding: 0.5rem;
    }
    textarea {
        height: 100px;  
    }
    input, textarea, button {
        padding: 0.5rem;
        width: 100%;
    }
    p {
        cursor: pointer;
        text-align: center;
    }
    p:hover {
        color: gray;
    }
`;


export default Auth;