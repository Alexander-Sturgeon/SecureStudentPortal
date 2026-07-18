import { useState } from "react"
import { Navigate } from "react-router-dom";

import '../styles/ClassListPage.css'

import ClassCard from "../components/ClassCard";

export default function ClassListPage(){
    //This controls wether they can view this page
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const term = "Summer 2026";

    function HandleChange(){
        return(
            <></>
        );
    }

    return(
        <section className="classlist-body">
            {isLoggedIn ?
            <div className="classlist-islogged">
                <div className="classlist-header">
                    <h1>MY CLASSES</h1>
                    <h3>{term}: X Classes</h3>
                </div>
                <div className="classlist-searchbar">
                    <label>Search: </label>
                    <input type="text" onChange={HandleChange} placeholder="Search by Class or Teacher ..."/>
                </div>
                <div className="classlist-classes">
                    {/* Map over both students and teachers classes */}
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                </div>
            </div>:
            // This sends them back to login page with the message if they aren't logged it
            <Navigate to={"/"} state={{message: 'Must be logged in.'}}/>
            }
        </section>
    )
}