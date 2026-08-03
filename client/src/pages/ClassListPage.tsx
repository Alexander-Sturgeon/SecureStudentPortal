import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom";

import '../styles/ClassListPage.css'

import ClassCard from "../components/ClassCard";
import { GetClasses } from "../services/classes";
import type { ClassListItem } from "../services/classes";

//  Search filter - checks name, class code, and teacher name
function filterClasses(items: ClassListItem[], search: string){
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.class_id.toLowerCase().includes(query) ||
        item.teacher_name.toLowerCase().includes(query)
    );
}

export default function ClassListPage(){
    //This controls wether they can view this page
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    //Add a get based on user and if that user returns true setIsLoggedIn == true (is set true by default now just for testing)

    const term = "Summer 2026";

    const [classes, setClasses] = useState<ClassListItem[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        GetClasses().then(setClasses);
    }, []);

    const filteredClasses = filterClasses(classes, search);

    return(
        <section className="classlist-body">
            {isLoggedIn ?
            <div className="classlist-islogged">
                <div className="classlist-header">
                    <h1>MY CLASSES</h1>
                    <h3>{term}: {filteredClasses.length} Classes</h3>
                </div>
                <div className="classlist-searchbar">
                    <label>Search: </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Class or Teacher ..."
                    />
                </div>
                <div className="classlist-classes">
                    {filteredClasses.map((c) => (
                        <ClassCard
                            key={c.class_id}
                            Id={c.class_id}
                            Term={term}
                            Code={c.class_id}
                            Name={c.name}
                            Professor={c.teacher_name}
                            AssignmentCount={c.assignment_count}
                            LectureCount={c.lecture_count}
                        />
                    ))}
                </div>
            </div>:
            // This sends them back to login page with the message if they aren't logged it
            <Navigate to={"/"} state={{message: 'Must be logged in.'}}/>
            }
        </section>
    )
}