import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/NavBar.css'

function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
                {isLoggedIn ? "User Name Here" : <button className="nav-buttons"><Link to='/login' className="nav-link" aria-label="Login Navigation">Login </Link></button>}
                
            </div>
        </div>
    )
}
export default Navbar;