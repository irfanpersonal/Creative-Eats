import {useDispatch, useSelector} from "react-redux";
import {type UserType} from "../features/user/userSlice";
import {type useDispatchType, type useSelectorType} from '../store';
import {updateUser} from "../features/profile/profileThunk";

interface EditProfileProps {
    profileData: UserType | null,
    toggleWantsToEdit: () => void
}

const EditProfile: React.FunctionComponent<EditProfileProps> = ({profileData, toggleWantsToEdit}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {editUserLoading} = useSelector((store: useSelectorType) => store.profile);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        const target = event.target as HTMLFormElement;
        if (target.profilePicture.files[0]) {
            formData.append('profilePicture', target.profilePicture.files[0]);
        }
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('bio', (target.elements.namedItem('bio') as HTMLInputElement).value);
        formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
        dispatch(updateUser(formData));
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <p>Current Image</p>
                <img src={profileData!.profilePicture}/>
                <input id="profilePicture" type="file" name="profilePicture"/>
            </div>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" defaultValue={profileData!.name} required/>
            </div>
            <div>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" name="email" defaultValue={profileData!.email} required/>
            </div>
            <div>
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" name="bio" defaultValue={profileData!.bio} required></textarea>
            </div>
            <div>
                <label htmlFor="location">Location</label>
                <input id="location" type="text" name="location" defaultValue={profileData!.location} required/>
            </div>
            <button style={{marginTop: '1rem'}} type="button" onClick={toggleWantsToEdit}>CANCEL</button>
            <button style={{marginTop: '1rem'}} type="submit" disabled={editUserLoading}>{editUserLoading ? 'EDITING' : 'EDIT'}</button>
        </form>
    );
}

export default EditProfile;