import { useState } from "react";
import LoginComp from "../components/LoginComp";
import RegisterComp from "../components/RegisterComp";
import '../styles/LoginPage.css'

function LoginPage(){
    const [loginToggle, setLoginToggle] = useState(true);

    return(
        <section className="login-body">
            <div className="login-panel">
                {loginToggle ? <LoginComp/> : <RegisterComp/>}
                <button className="login-comp-select" onClick={() => (setLoginToggle(!loginToggle))}>{loginToggle ? "Create an Account":"Have an Account?"}</button>
            </div>
        </section>
    )
}
export default LoginPage;