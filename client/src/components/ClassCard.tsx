import { useState } from 'react';
import '../styles/ClassListPage.css'

//Remember to fill out the props based on what elements belong in the card
export default function ClassCard(){
    const [hasLectures, setHasLectures] = useState(true);
    const [hasAssignments, setHasAssignments] = useState(true);
    return(
        <div className="card-body">
            <h3 className='card-term'>Summer 2026</h3>
            <h2 className='card-heading'>ENGL201 - Modern Poetry</h2>
            <h3 className='card-prof'><em>Alexander Sturgeon</em></h3>
            <div className='card-divider'></div>
            <div className='card-class-items'>
                {hasAssignments && <p className='card-assignments'>X Assignments</p>}
                {hasLectures && <p className='card-lectures'>X Lectures</p>}
            </div>
        </div>
    )
}