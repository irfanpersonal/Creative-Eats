import {FaInfoCircle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {updateUserPassword} from "../features/settings/settingsThunk";

const ChangePassword: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {updateUserPasswordLoading} = useSelector((store: useSelectorType) => store.settings);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('oldPassword', (target.elements.namedItem('oldPassword') as HTMLInputElement).value);
        formData.append('newPassword', (target.elements.namedItem('newPassword') as HTMLInputElement).value);
        dispatch(updateUserPassword(formData));
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="center"><FaInfoCircle/></div>
            <p className="center">To change your password enter your current password in the "Old Password" field and set a new one in the "New Password" field to complete the process.</p>
            <div>
                <label htmlFor="oldPassword">Old Password</label>
                <input id="oldPassword" type="password" name="oldPassword"/>
            </div>
            <div>
                <label htmlFor="newPassword">New Password</label>
                <input id="newPassword" type="password" name="newPassword"/>
            </div>
            <button type="submit" disabled={updateUserPasswordLoading}>{updateUserPasswordLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
        </form>
    );
}

export default ChangePassword;