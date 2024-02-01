import React from 'react';
import styled from 'styled-components';
import {FaSearch} from "react-icons/fa";
import {type useDispatchType, type useSelectorType} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUsers} from '../features/search/searchThunk';
import {Loading, PaginationBox} from '../components';
import {resetPage, updateSearchBoxValues, setPage} from '../features/search/searchSlice';
import moment from 'moment';
import {Link} from 'react-router-dom';

const Search: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {searchBoxValues, users, getAllUsersLoading, numberOfPages, page} = useSelector((store: useSelectorType) => store.search);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(resetPage());
        dispatch(getAllUsers());
    }
    React.useEffect(() => {
        dispatch(getAllUsers());
    }, []);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="search">Search</label>
                    <input id="search" type="search" name="search" value={searchBoxValues.search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="sort">Sort</label>
                    <select id="sort" name="sort" value={searchBoxValues.sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                        <option value=""></option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                </div>
                <button type="submit"><FaSearch/></button>
            </form>
            {getAllUsersLoading ? (
                <Loading title="Loading All Users" position='normal' marginTop='1rem'/>
            ) : (
                <section>
                    {!users.length && (
                        <h1 style={{textAlign: 'center', margin: '1rem 0'}}>No Users Found...</h1>
                    )}
                    {users.map(user => {
                        return (
                            <Link key={user._id} style={{textDecoration: 'none', color: 'black'}} to={`/profile/${user._id}`}>
                                <article key={user._id}>
                                    <div>
                                        <img src={user.profilePicture}/>
                                    </div>
                                    <div>{user.name}</div>
                                    <div>{moment(user.createdAt).format('MMMM Do YYYY')}</div>
                                </article>
                            </Link>
                        );
                    })}
                </section>
            )}
            {numberOfPages! > 1 && (
                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getAllUsers}/>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        background-color: rgb(254, 234, 167);
        outline: 1px solid black;
        margin: 0 auto;
        padding: 0.5rem;
    }
    form label {
        display: block;
    }
    input, select, button {
        width: 100%;
        padding: 0.25rem;
    }
    button {
        margin-top: 1rem;
    }
    img {
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
    }
    section {
        margin: 0 auto;
    }
    article {
        border: 1px solid black;
        padding: 0.5rem;
        margin: 1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(254, 234, 167);
    }
    article:hover {
        background-color: lightgray;
    }
`;

export default Search;