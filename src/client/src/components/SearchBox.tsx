import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import styled from 'styled-components';
import {FaSearch} from "react-icons/fa";

interface SearchBoxProps {
    searchBoxValues: {
        search: string,
        category: '' | 'breakfast' | 'lunch' | 'dinner' | 'dessert',
        minimumBudget: string,
        maximumBudget: string,
        sort: '' | 'a-z' | 'z-a',
    },
    updateSearchBoxValues: Function,
    updateSearch: Function,
    id?: string,
    setPage: Function
}

const SearchBox: React.FunctionComponent<SearchBoxProps> = ({searchBoxValues, updateSearchBoxValues, updateSearch, id, setPage}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleChange = (event: React.FormEvent) => {
        const target = event.target as HTMLInputElement;
        dispatch(updateSearchBoxValues({name: target.name, value: target.value}));
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(setPage(1));
        dispatch(updateSearch(id));
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <div>
                <label htmlFor="search">Search</label>
                <input id="search" type="search" name="search" value={searchBoxValues.search} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={searchBoxValues.category} onChange={handleChange}>
                    <option value=""></option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="dessert">Dessert</option>
                </select>
            </div>
            <div>
                <label htmlFor="sort">Sort</label>  
                <select id="sort" name="sort" value={searchBoxValues.sort} onChange={handleChange}>
                    <option value=""></option>
                    <option value="a-z">A-Z</option>
                    <option value="z-a">Z-A</option>
                </select>
            </div>
            <div>
                <label htmlFor="minimumBudget">Min</label>
                <input id="minimumBudget" min="0" type="number" name="minimumBudget" value={searchBoxValues.minimumBudget} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="maximumBudget">Max</label>
                <input id="maximumBudget" min="0" type="number" name="maximumBudget" value={searchBoxValues.maximumBudget} onChange={handleChange}/>
            </div>
            <div>
                <label>Search</label>
                <button style={{padding: '0.8rem'}} type="submit"><FaSearch/></button>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    width: 80%;
    margin: 0 auto;
    div {
        display: flex;
        flex-direction: column;
    }
    label {
        margin-bottom: 0.25rem;
    }
    input, select {
        padding: 0.5rem;
    }
    button {
        background-color: #4caf50;
        color: #fff;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            background-color: #45a049;
        }
    }
    @media (max-width: 850px) {
        grid-template-columns: 1fr;
    }
`;

export default SearchBox;