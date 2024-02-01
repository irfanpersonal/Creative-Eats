import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getUserFeed} from '../features/home/homeThunk';
import {Loading, RecipeListItem, HomeData} from '../components';
import {nanoid} from 'nanoid';
import {setPage} from '../features/home/homeSlice';

const Home: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {completeUserFeed, getUserFeedLoading, page, numberOfPages} = useSelector((store: useSelectorType) => store.home);
    React.useEffect(() => {
        if (!user) {
            return;
        }
        dispatch(getUserFeed());
    }, []);
    return (
        <div>
            {user ? (
                <>
                    {getUserFeedLoading ? (
                        <Loading title='Loading User Feed' position='normal'/>
                    ) : (
                        <>  
                            <h1 style={{textAlign: 'center', color: 'white', backgroundColor: 'black'}}>User Feed</h1>
                            {!completeUserFeed.length ? (
                                <>
                                    <h2 style={{textAlign: 'center', margin: '1rem 0'}}>No Recipes, Follow Someone!</h2>
                                </>
                            ) : (
                                <>
                                    {completeUserFeed.map(recipe => {
                                        return (
                                            <RecipeListItem key={nanoid()} data={recipe}/> 
                                        );
                                    })}
                                    {!(numberOfPages === 1 || page === numberOfPages) && (
                                        <button style={{width: '100%', padding: '0.5rem'}} onClick={() => {
                                            const newPage = page + 1;
                                            if (newPage > numberOfPages!) {
                                                return;
                                            }
                                            dispatch(setPage(newPage));
                                            dispatch(getUserFeed());
                                        }}>View More</button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            ) : (
                <HomeData/>
            )}
        </div>
    );
}

export default Home;