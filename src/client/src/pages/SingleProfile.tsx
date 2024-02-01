import React from 'react';
import {Wrapper} from './Profile';
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {followUser, getSingleProfileData, getSingleProfileRecipes, unfollowUser} from '../features/singleProfile/singleProfileThunk';
import {Loading, SearchBox, RecipeList, PaginationBox, Modal} from '../components';
import {FaTag, FaInfoCircle, FaLocationArrow} from 'react-icons/fa';
import {useNavigate, useParams} from 'react-router-dom';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {updateSearchBoxValues, setPage} from '../features/singleProfile/singleProfileSlice';
import {FaUsers, FaUserFriends} from 'react-icons/fa';
import {RiChatFollowUpFill, } from 'react-icons/ri';
import {type UserType} from '../features/user/userSlice';

const SingleProfile: React.FunctionComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {singleProfileData, singleProfileDataLoading, recipes, singleProfileRecipesLoading, searchBoxValues, totalRecipes, numberOfPages, page, followUserLoading, unfollowUserLoading} = useSelector((store: useSelectorType) => store.singleProfile);
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
    React.useEffect(() => {
        if (user!?.userID === id) {
            navigate('/profile');
        }
        dispatch(getSingleProfileData(id!));
        dispatch(getSingleProfileRecipes(id!));
    }, [id]);
    return (
        <Wrapper>
            {singleProfileDataLoading ? (
                <Loading title="Loading Single Profile" position='normal'/>
            ) : (
                <>
                    <h1 style={{textAlign: 'center', backgroundColor: 'black', color: 'white'}}>Profile</h1>
                    <img src={singleProfileData!.profilePicture || emptyProfilePicture}/>
                    <div style={{textAlign: 'center', margin: '1rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div onClick={() => {
                            if (!singleProfileData!.following.length) {
                                return;
                            }
                            setModal(currentState => {
                                return {title: 'Following', isOpen: true, data: singleProfileData!.following};
                            });
                        }} className="box" style={{marginRight: '1rem'}}>
                            <FaUserFriends/>
                            <div>Following: {singleProfileData!.following.length}</div>
                        </div>
                        <div onClick={() => {
                            if (!singleProfileData!.followers.length) {
                                return;
                            }
                            setModal(currentState => {
                                return {title: 'Followers', isOpen: true, data: singleProfileData!.followers};
                            });
                        }} className="box">
                            <FaUsers/>
                            <div>Followers: {singleProfileData!.followers.length}</div>
                        </div>
                    </div>
                    <button disabled={followUserLoading || unfollowUserLoading} onClick={() => {
                        if (!user) {
                            navigate('/auth');
                            return;
                        }
                        else if (singleProfileData!.followers.some(follower => follower._id === user!?.userID)) {
                            dispatch(unfollowUser(id as string));
                            return;
                        }
                        dispatch(followUser(id as string));
                    }}>
                        {singleProfileData!.followers.some(follower => follower._id === user!?.userID) ? (
                            <>
                                <div>{unfollowUserLoading ? 'Unfollowing' : 'Unfollow'}</div>
                                <div><RiChatFollowUpFill className="icon"/></div>
                            </>
                        ) : (
                            <>
                                <div>{followUserLoading ? 'Following' : 'Follow'}</div>
                                <div><RiChatFollowUpFill className="icon"/></div>
                            </>
                        )}
                    </button>
                    <p><span><FaTag/></span>{singleProfileData!.name}</p>
                    <p><span><FaInfoCircle/></span>{singleProfileData!.bio || 'No Bio Provided!'}</p>
                    <p><span><FaLocationArrow/></span>{singleProfileData!.location || 'No Location Provided!'}</p>
                </>
            )}
            {singleProfileRecipesLoading ? (
                <Loading title="Loading Single Profile Recipes" position='normal'/>
            ) : (
                <>
                    <SearchBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getSingleProfileRecipes} setPage={setPage} id={id!}/>
                    <RecipeList data={recipes} totalRecipes={totalRecipes}/>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getSingleProfileRecipes} _id={id}/>
                    )}
                </>
            )}
            {modal.isOpen && (
                <Modal title={modal.title} data={modal.data} closeModal={closeModal}/>
            )}
        </Wrapper>
    );
}

export default SingleProfile;