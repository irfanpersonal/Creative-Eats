import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, RecipeData, EditRecipeData} from '../components';
import {deleteSingleRecipe, getSingleRecipe} from '../features/singleRecipe/singleRecipeThunk';
import {useNavigate, useParams} from 'react-router-dom';
import {FaArrowAltCircleLeft, FaEdit, FaTrash} from "react-icons/fa";
import {IoCopyOutline} from "react-icons/io5";
import {IoMdCloseCircle} from "react-icons/io";
import {MdAutoDelete} from "react-icons/md";
import {toast} from 'react-toastify';

const Recipe: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {singleRecipe, singleRecipeLoading, editSingleRecipeLoading, deleteSingleRecipeLoading} = useSelector((store: useSelectorType) => store.singleRecipe);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const toggleEditing = () => {
        setIsEditing(currentState => {
            return !currentState;
        });
    }
    React.useEffect(() => {
        dispatch(getSingleRecipe(id!));
    }, []);
    return (
        <>
            {singleRecipeLoading ? (
                <Loading title="Loading Single Recipe" position="normal"/>
            ) : (
                <Wrapper>
                    <div className="title-box">
                        <div onClick={() => {
                            navigate(-1);
                        }}><FaArrowAltCircleLeft title="Back"/></div>
                        <div>{isEditing ? 'Edit Recipe' : singleRecipe!.name}</div>
                        <div>
                            {user!?.userID === singleRecipe!?.user._id ? (
                                <>
                                    <span onClick={toggleEditing}>{isEditing ? <IoMdCloseCircle title="Cancel"/> : <FaEdit title="Edit"/>}</span>
                                    <span onClick={() => {
                                        if (deleteSingleRecipeLoading) {
                                            return;
                                        }
                                        dispatch(deleteSingleRecipe(id!));
                                    }}>{deleteSingleRecipeLoading ? <MdAutoDelete/> : <FaTrash/>}</span>
                                    <span onClick={async() => {
                                        if (navigator.clipboard) {
                                            await navigator.clipboard.writeText(window.location.href);
                                        }
                                        toast.success('Copied Link!');
                                    }}><IoCopyOutline/></span>
                                </>
                            ) : (
                                <>
                                    <span onClick={async() => {
                                        if (navigator.clipboard) {
                                            await navigator.clipboard.writeText(window.location.href);
                                        }
                                        toast.success('Copied Link!');
                                    }}><IoCopyOutline/></span>
                                </>
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <EditRecipeData singleRecipe={singleRecipe!}/>
                    ) : (
                        <RecipeData singleRecipe={singleRecipe!}/>
                    )}
                </Wrapper>
            )}
        </>
    );
}

const Wrapper = styled.div`
    font-size: 1rem;
    .title-box {
        outline: 1px solid black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(254, 234, 167);
        padding: 0.5rem;
    }
    div > span {
        margin-left: 1rem;
    }
    .info {
        margin-top: 1rem;
    }
    img {
        display: block;
        width: 12rem;
        height: 12rem;
        border: 1px solid black;
        margin: 0 auto;
        margin-top: 1rem;
    }
    p {
        outline: 1px solid black;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: white;
    }
    p > span {
        margin-right: 0.5rem;
    }
    ul {
        list-style: none;
        li {
            border-bottom: 1px solid black;
            margin-bottom: 1rem;
        }
    }
    .center {
        text-align: center;
    }
    .block {
        display: block;
    }
    svg {
        cursor: pointer;
    }
    form {
        padding: 1rem;
        background-color: rgb(255, 234, 167);
        border-radius: 0.25rem;
        margin: 0 auto;
        margin-top: 1rem;
        font-size: 1rem;
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
    input, textarea, button, select {
        padding: 0.5rem;
        width: 100%;
    }
    .option {
        background-color: lightgray;
        padding: 0 0.5rem;
        border: 1px solid black;
        cursor: pointer;
        user-select: none;
    }
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
`;

export default Recipe;