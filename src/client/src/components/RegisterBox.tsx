const RegisterBox: React.FunctionComponent = () => {
    return (
        <>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name"/>
            </div>
            <div>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" name="email"/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password"/>
            </div>
            <div>
                <label htmlFor="profilePicture">Profile Picture</label>
                <input id="profilePicture" type="file" name="profilePicture"/>
            </div>
            <div>
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" name="bio"></textarea>
            </div>
            <div>
                <label htmlFor="location">Location</label>
                <input id="location" type="text" name="location"/>
            </div>
        </>
    );
}

export default RegisterBox;