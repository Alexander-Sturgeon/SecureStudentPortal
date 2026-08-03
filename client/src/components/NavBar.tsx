import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {Logout} from "../services/auth";
import '../styles/NavBar.css'

function Navbar(){
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const[isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") == "true");
    const location = useLocation();
    const navigate = useNavigate();

    //re-reads the flag whenever the route changes. 
    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }, [location.pathname]);

    const HandleLogout = async () => {
        await Logout();
        localStorage.removeItem("isLoggedIn")
        setIsLoggedIn(false);
        navigate("/");
    }

    return(
        <div className="nav-body">
            <div className="nav-left">
                <img src="" alt="App Logo"/>
                <h3>UNI APP</h3>
                <p> | </p>
                <button className="nav-buttons">
                    <Link to='/classes' className="nav-link" aria-label="Class List Navigation">
                        Classes
                    </Link>
                </button>
            </div>
            <div className="nav-right">
                <p> | </p>
                {isLoggedIn ? <div style={{display: 'flex',}}><p>Username Here</p><p>&nbsp;|&nbsp;</p><button className="nav-buttons" onClick={HandleLogout}>Logout</button></div> : <button className="nav-buttons"><Link to='/login' className="nav-link" aria-label="Login Navigation">Login </Link></button>}
                
            </div>
        </div>
    )
}
export default Navbar;