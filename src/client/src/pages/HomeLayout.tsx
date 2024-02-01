import {Outlet} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout: React.FunctionComponent = () => {
    return (
        <>
            <Navbar/>
            <section style={{padding: '1rem', marginLeft: '25%'}}>
                <Outlet/>
            </section>
        </>
    );
}

export default HomeLayout;