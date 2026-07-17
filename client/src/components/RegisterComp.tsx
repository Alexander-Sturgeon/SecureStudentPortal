

export default function RegisterComp(){
    return(
        <div className="login-comp-body">
            <div className="login-comp-heading"><h2>Register</h2></div>
            <div className="login-comp-divider"></div>
            <div className="login-comp-form">
                <form>
                    <div className="login-comp-field">
                        <label>Email Address:</label>
                        <input id="register-email" name="login-email" type="text" required/>
                    </div>
                    <div className="login-comp-field">
                        <label>First Name:</label>
                        <input id="register-fname" name="login-fname" type="text" required/>
                    </div>
                    <div className="login-comp-field">
                        <label>Last Name:</label>
                        <input id="register-lname" name="login-lname" type="text" required/>
                    </div>
                    <div className="login-comp-field">
                        <label>Mailing Address:</label>
                        <input id="register-address" name="login-address" type="text" required/>
                    </div>
                    <div className="login-comp-field">
                        <label>Password:</label>
                        <input id="register-password" name="login-password" type="text" required/>
                    </div>
                    <button className="submit-button">Register</button>
                </form>
            </div>
            <div className="login-comp-divider"></div>
        </div>
    )
}