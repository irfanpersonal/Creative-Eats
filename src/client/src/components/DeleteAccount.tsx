import {FaInfoCircle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {deleteAccount} from "../features/settings/settingsThunk";

const DeleteAccount: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {deleteAccountLoading} = useSelector((store: useSelectorType) => store.settings);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const password = (target.elements.namedItem('password') as HTMLInputElement).value;
        dispatch(deleteAccount(password));
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="center"><FaInfoCircle/></div>
            <p className="center">You are about to delete your account. This action is irreversible. Complete this action by entering in your password.</p>
            <div>
                <label htmlFor="password">Enter password</label>
                <input id="password" type="password" name="password"/>
            </div>
            <button disabled={deleteAccountLoading}>{deleteAccountLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
        </form>
    );
}

export default DeleteAccount;