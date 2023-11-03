import {Navigate} from 'react-router-dom';
import {getUserFromLocalStorage} from '../utils';

const ProtectedRoute = ({children}) => {
    const user = getUserFromLocalStorage();
    if (!user) {
        return <Navigate to='/'/>
    }
    return children;
}   

export default ProtectedRoute;