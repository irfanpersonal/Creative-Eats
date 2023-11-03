import {Outlet, useNavigation} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout = () => {
    const navigation = useNavigation();
    const isPageLoading = navigation.state === 'loading';
    return (
        <>
            <Navbar/>
            <section style={{padding: '1rem'}}>
                {isPageLoading ? (
                    <h1 style={{textAlign: 'center', backgroundColor: 'black', color: 'white'}}>Loading...</h1>
                ) : (
                    <Outlet/>
                )}
            </section>
        </>
    );
}

export default HomeLayout;