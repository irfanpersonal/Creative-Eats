import React from 'react';
import styled from 'styled-components';
import {ChangePassword, DeleteAccount} from '../components';

const Setting: React.FunctionComponent = () => {
    const [showChangePassword, setShowChangePassword] = React.useState<boolean>(false);
    const [showDeleteAccount, setShowDeleteAccount] = React.useState<boolean>(false);
    return (
        <Wrapper>
            <h1 className="title">Settings</h1>
            <div>
                <h1 onClick={() => setShowChangePassword(currentState => !currentState)} className="option">Change Password</h1>
                {showChangePassword && (
                    <ChangePassword/>
                )}
                <h1 onClick={() => setShowDeleteAccount(currentState => !currentState)} className="option">Delete Account</h1>
                {showDeleteAccount && (
                    <DeleteAccount/>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    .option {
        margin-top: 1rem;
        cursor: pointer;
        text-decoration: underline;
    }
    p {
        margin-bottom: 1rem;
    }
    form {
        margin-top: 1rem;
        background-color: rgb(255, 234, 167);
        padding: 0.5rem;
        label {
            display: block;
        }
        input, button {
            padding: 0.5rem;
            width: 100%;
        }
        button {
            margin-top: 1rem;
        }
    }
    .center {
        text-align: center;
    }
`;

export default Setting;