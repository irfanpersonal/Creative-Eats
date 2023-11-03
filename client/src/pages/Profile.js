import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {updateUser} from '../features/user/userThunk';
import React from 'react';

const Profile = () => {
    const dispatch = useDispatch();
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateUser(input));
    }
    const {isLoading, user} = useSelector(store => store.user);
    const [input, setInput] = React.useState({
        name: user.name,
        email: user.email
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    return (
        <div>
            <Wrapper onSubmit={handleSubmit}>
                <h1>Profile</h1>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name" value={input.name} onChange={handleChange} required/>
                </div>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" name="email" value={input.email} onChange={handleChange} required/>
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'UPDATING' : 'UPDATE'}</button>
            </Wrapper>
        </div>
    );
}

const Wrapper = styled.form`
    border: 1px solid black;
    width: 50%;
    margin: 0 auto 1rem auto;
    padding: 1rem;
    h1 {
        text-align: center;
        background-color: lightblue;
    }
    input {
        display: block;
        width: 100%;
        padding: 0.5rem;
    }
    label, button {
        display: block;
        margin-top: 1rem;
        width: 100%;
    }
    button {
        padding: 0.5rem;
    }
    #foodImage {
        padding: 0;
        width: 100%;
    }
    textarea {
        width: 100%;
        min-height: 100px;
    }
    p {
        margin-top: 1rem;
    }
    img {
        display: block;
        width: 100%;
        height: 10%;
    }
`;

export default Profile;