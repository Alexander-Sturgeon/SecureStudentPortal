import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/ClassListPage.css'

interface ClassCardProps {
    Id: string;
    Term: string;
    Code: string;
    Name: string;
    Professor: string;
    AssignmentCount: number;
    LectureCount: number;
}
//Remember to fill out the props based on what elements belong in the card
export default function ClassCard({ Id, Term, Code, Name, Professor, AssignmentCount, LectureCount }: ClassCardProps){
    const [hasLectures, setHasLectures] = useState(false);
    const [hasAssignments, setHasAssignments] = useState(false);
    useEffect(() => {
        if (AssignmentCount > 0){
            setHasAssignments(true);
        }
        
    },[AssignmentCount]);
    useEffect(() => {
        if(LectureCount > 0){
            setHasLectures(true);
        }
        
    }, [LectureCount])
    return(
        <>                    
            <Link to={`/class/${Id}`} className="card-nav" aria-label={`View ${Code}`}>
                <div className="card-body">
                    <h3 className='card-term'>{Term}</h3>
                    <h2 className='card-heading'>{Code} - {Name}</h2>
                    <h3 className='card-prof'><em>{Professor}</em></h3>
                    <div className='card-divider'></div>
                    <div className='card-class-items'>
                        {hasAssignments && <p className='card-assignments'>{AssignmentCount} Assignments</p>}
                        {hasLectures && <p className='card-lectures'>{LectureCount} Lectures</p>}
                    </div>
                </div>
            </Link>
        </>
        
    )
}