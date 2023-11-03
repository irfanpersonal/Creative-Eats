import axios from 'axios';

const customFetch = axios.create({
    baseURL: 'http://localhost:4000/api/v1/'
});

customFetch.interceptors.request.use((request) => {
    const user = getUserFromLocalStorage();
    if (user) {
        request.headers['authorization'] = `Bearer ${user.token}`;
    }
    return request;
});

export default customFetch;

export const getUserFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('user')) || null;
}

export const addUserFromLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
}