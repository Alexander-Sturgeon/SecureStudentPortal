import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Login} from "../services/auth";

export default function LoginComp(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[message, setMessage] = useState("");
    const navigate = useNavigate(); 

    //handles form submit of the login page. uses Login function from services page with the email password entered by the user. 
    const HandleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const result = await Login(email, password);

        if(result.success){
            localStorage.setItem("isLoggedIn", "true");
            navigate("/classes");
            return;
        }

        setMessage(result.message ?? "Login failed.");
    }

    return(
        <div className="login-comp-body">
            <div className="login-comp-heading"><h2>LOG IN</h2></div>
            <div className="login-comp-divider"></div>
            <div className="login-comp-form">
                <form onSubmit={HandleSubmit}>
                    <div className="login-comp-field">
                        <label>Email Address:</label>
                        <input id="login-email" name="login-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="login-comp-field">
                        <label>Password:</label>
                        <input id="login-password" name="login-password" type="text" value={password} onChange={(e) => setPassword(e.target.value)}required/>
                    </div>
                    <button className="submit-button">Login</button>
                </form>
                {message && <p className="login-comp-message">{message}</p>}
            </div>
            <div className="login-comp-divider"></div>
        </div>
    )
}