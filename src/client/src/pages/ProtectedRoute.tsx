import {useSelector} from "react-redux";
import {useSelectorType} from '../store';
import {Navigate} from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({children}): any => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    if (!user) {
        return <Navigate to='/'/>
    }
    return children;
}

export default ProtectedRoute;