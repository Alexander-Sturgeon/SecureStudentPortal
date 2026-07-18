import { useState } from "react";
import {useLocation} from 'react-router-dom';
import LoginComp from "../components/LoginComp";
import RegisterComp from "../components/RegisterComp";
import '../styles/LoginPage.css'

function LoginPage(){
    const [loginToggle, setLoginToggle] = useState(true);
    const location = useLocation();
    const alertMessage = location.state?.message;
    return(
        <section className="login-body">
            <div className="login-panel">
                <p className="auth-alert-message">{alertMessage ?? alertMessage}</p>
                {loginToggle ? <LoginComp/> : <RegisterComp/>}
                <button className="login-comp-select" onClick={() => (setLoginToggle(!loginToggle))}>{loginToggle ? "Create an Account":"Have an Account?"}</button>
            </div>
        </section>
    )
}
export default LoginPage;