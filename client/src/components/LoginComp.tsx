

export default function LoginComp(){
    return(
        <div className="login-comp-body">
            <div className="login-comp-heading"><h2>LOG IN</h2></div>
            <div className="login-comp-divider"></div>
            <div className="login-comp-form">
                <form>
                    <div className="login-comp-field">
                        <label>Email Address:</label>
                        <input id="login-email" name="login-email" type="text" required/>
                    </div>
                    <div className="login-comp-field">
                        <label>Password:</label>
                        <input id="login-password" name="login-password" type="text" required/>
                    </div>
                    <button className="submit-button">Login</button>
                </form>
            </div>
            <div className="login-comp-divider"></div>
        </div>
    )
}