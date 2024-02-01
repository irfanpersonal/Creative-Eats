import styled from 'styled-components';
import {FaWindowClose} from "react-icons/fa";
import {type UserType} from '../features/user/userSlice';
import {Link} from 'react-router-dom';
import {nanoid} from 'nanoid';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';

interface ModalProps {
    title: string,
    data: UserType[],
    closeModal: () => void,
}

const Modal: React.FunctionComponent<ModalProps> = ({title, data, closeModal}) => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper>
            <div className="modal-menu">
                <div style={{textAlign: 'center', margin: '0 auto'}}>{title}</div>
                <div><FaWindowClose onClick={closeModal} className="close"/></div>
            </div>
            <section style={{width: '100%', height: '150px', overflow: 'auto'}}>
                {data.map(item => {
                    return (
                        <Link onClick={closeModal} key={nanoid()} to={`/profile${item._id === user!?.userID ? '' : `/${item._id}`}`}>
                            <article style={{textAlign: 'center', borderBottom: '1px solid black'}}>
                                <img style={{width: '3rem', height: '3rem'}} src={item.profilePicture}/>
                                <div>{item.name}</div>
                            </article>
                        </Link>
                    );
                })}
            </section>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .modal-menu {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        border-bottom: 1px solid black;
    }
    .close:hover, .close:hover {
        cursor: pointer;
        color: rgb(255, 0, 77);
    }
    width: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid black;
    padding: 1rem;
`;

export default Modal;