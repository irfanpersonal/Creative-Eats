import React from 'react';
import styled from 'styled-components';
import {getProfileData, getUserRecipes, logoutUser} from '../features/profile/profileThunk';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from '../store';
import {Loading, EditProfile, SearchBox, RecipeList, PaginationBox, Modal} from '../components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {FaTag, FaInfoCircle, FaLocationArrow, FaEdit, FaUsers, FaUserFriends} from "react-icons/fa";
import {setPage, updateSearchBoxValues} from '../features/profile/profileSlice';
import {type UserType} from '../features/user/userSlice';

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {profileData, profileDataLoading, logoutLoading, myRecipesLoading, recipes, totalRecipes, numberOfPages, searchBoxValues, page} = useSelector((store: useSelectorType) => store.profile);
    const [wantsToEdit, setWantsToEdit] = React.useState(false);
    const [modal, setModal] = React.useState<{isOpen: boolean, title: string, data: UserType[]}>({
        isOpen: false,
        title: '',
        data: []
    });
    const closeModal = () => {
        setModal(currentState => {
            return {...currentState, isOpen: false};
        });
    }
    const toggleWantsToEdit = () => {
        setWantsToEdit(currentState => {
            return !currentState;
        });
    }
    React.useEffect(() => {
        dispatch(getProfileData(user!.userID));
        dispatch(getUserRecipes(user!.userID));
    }, []);
    return (
        <Wrapper>
            <h1 className="title">My Profile</h1>
            {profileDataLoading ? (
                <Loading title="Loading Profile Data" position='normal' marginTop='1rem'/>
            ) : (
                <div>
                    {wantsToEdit ? (
                        <EditProfile profileData={profileData} toggleWantsToEdit={toggleWantsToEdit}/>
                    ) : (
                        <>
                            <img src={profileData!.profilePicture || emptyProfilePicture}/>
                            <div style={{textAlign: 'center', margin: '1rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div onClick={() => {
                                    if (!profileData!.following.length) {
                                        return;
                                    }
                                    setModal(currentState => {
                                        return {title: 'Following', isOpen: true, data: profileData!.following};
                                    });
                                }} className="box" style={{marginRight: '1rem'}}>
                                    <FaUserFriends/>
                                    <div>Following: {profileData!.following.length}</div>
                                </div>
                                <div onClick={() => {
                                    if (!profileData!.followers.length) {
                                        return;
                                    }
                                    setModal(currentState => {
                                        return {title: 'Followers', isOpen: true, data: profileData!.followers};
                                    });
                                }} className="box">
                                    <FaUsers/>
                                    <div>Followers: {profileData!.followers.length}</div>
                                </div>
                            </div>
                            <button type="submit" className="btn" onClick={toggleWantsToEdit}><FaEdit/></button>
                            <p><span><FaTag/></span>{profileData!.name}</p>
                            <p><span><FaInfoCircle/></span>{profileData!.bio || 'No Bio Provided!'}</p>
                            <p><span><FaLocationArrow/></span>{profileData!.location || 'No Location Provided!'}</p>
                        </>
                    )}
                </div>
            )}
            <h1 style={{margin: '1rem 0'}} className="title">My Recipes</h1>
            <SearchBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getUserRecipes} id={user!.userID} setPage={setPage}/>
            {myRecipesLoading ? (
                <Loading title="Loading My Recipes" position="normal" marginTop='1rem'/>
            ) : (
                <>
                    <RecipeList data={recipes} totalRecipes={totalRecipes}/>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getUserRecipes} _id={user!.userID}/>
                    )}
                </>
            )}
            <button style={{marginTop: '1rem', padding: '0.8rem'}} type="button" className="btn" disabled={logoutLoading} onClick={() => dispatch(logoutUser())}>{logoutLoading ? 'LOGGING OUT...' : 'LOGOUT'}</button>
            {modal.isOpen && (
                <Modal title={modal.title} data={modal.data} closeModal={closeModal}/>
            )}
        </Wrapper>
    );
}

export const Wrapper = styled.div`
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    img {
        display: block;
        margin: 1rem auto;
        width: 8rem;
        height: 8rem;
        border-radius: 50%;
        outline: 1px solid black;
    }
    p {
        text-align: center;
        background-color: lightgray;
        margin: 1rem 0;
        padding: 0.5rem;
        border-radius: 1rem;
        outline: 1px solid black;
    }
    p > span {
        display: block;
        margin-right: 0.5rem;
    }
    .btn {
        display: block;
        margin: 0 auto;
        padding: 0.5rem;
    }
    label, input, textarea {
        display: block;
    }
    input, textarea, button {
        width: 100%;
        padding: 0.5rem;
    }
    textarea {
        resize: none;
        height: 120px;
    }
    input[type="file"] {
        padding: 0;
        outline: 1px solid black;
        padding: 0.5rem;
    }
    .box {
        border: 1px solid black;
        padding: 0.5rem;
        background-color: rgb(254, 234, 167);
        cursor: pointer;
        user-select: none;
    }
    .box:hover {
        outline: 1px solid black;
    }
`;

export default Profile;