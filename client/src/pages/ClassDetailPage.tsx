import { Link, useParams, Navigate } from "react-router-dom"
import { useState, useEffect } from "react";
import '../styles/ClassDetailPage.css';

import { GetClassDetail } from "../services/classes";
import type { ClassDetail } from "../services/classes";

import AddLectureComp from "../components/AddLectureComp";
import AddAssignmentComp from "../components/AddAssignmentComp";
import AddStudentComp from "../components/AddStudentComp";

interface Lecture {
      Id: number;
      Date: string;
      Title: string;
      Status: number;
      Subject: string;
      Content: string;    
  }
export default function ClassDetailPage(){
    //The class id from the url, used to ask the api for this class
    const {id} = useParams();
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(true);

    //The server decides whether this user may edit, the client just renders it
    const canEdit = classDetail?.can_edit ?? false;

    const [isAddLectureComp, setIsAddLectureComp] = useState(false);
    const [isAddAssignmentComp, setIsAddAssignmentComp] = useState(false);
    const [isAddStudentComp, setIsAddStudentComp] = useState(false);
    const [lectureOutput, setLectureOutput] = useState<Lecture | null>(null);
    const [lectureToggle, setLectureToggle] = useState(false);
    const lectureDisplay = (lecture : Lecture) =>{
        setLectureToggle(true)
        setLectureOutput(lecture)
    }
    useEffect(() => {
        if(!id){ return; }

        //The api only answers for a class this user is enrolled in or teaches
        GetClassDetail(id)
            .then(result => {
                setStatus(result.status);
                setClassDetail(result.data);
            })
            .catch(() => setStatus(0))
            .finally(() => setLoading(false));
    }, [id]);

    function StatusColor(status : number){
        switch(status){
            case 1: return 'yellow';
            case 2: return 'red';
            case 3: return 'gray';
            default: return 'blue';
        }
        
    }
    
    
    if(loading){
        return(
            <section className="detail-body"><p>Loading ...</p></section>
        )
    }

    //401 means there is no valid session, send them back to the login page
    if(status === 401){
        return <Navigate to={"/"} state={{message: 'Must be logged in.'}}/>
    }

    //The api returns 404 for a class that does not exist and for one this
    //user has no access to, so both land here on purpose
    if(!classDetail){
        return(
            <section className="detail-body"><p>Class not found.</p></section>
        )
    }

    return(
        <section className="detail-body">
                <div>
                    <div className="detail-back-btn"><Link to={`/classes`} className="assignment-nav" aria-label='Navigate to Class List'>{'<<'} Back to My Classes</Link></div>
                    <div className="detail-header">
                        {/* term is not in the database schema yet */}
                        <p>Fall 2026</p>
                        <h1>{classDetail.class_id} - {classDetail.name}</h1>
                        <p>{classDetail.teacher_name}</p>
                    </div>
                    <div className="detail-add-student">
                        {canEdit &&
                            <button className="detail-add-student-btn" onClick={() => setIsAddStudentComp(!isAddStudentComp)}>Add Student</button>
                        }
                    </div>
                    <div className="detail-info">
                        <div className="detail-assignment">
                            <h3 className="assignment-header">Assignments</h3>
                            <div className="assignment-list">
                                {/* MAP OVER LECTURES AND MAKE ONE OF THESE DIVS FOR EACH */}
                                <div className="assignment-single">
                                    <h4 className="detail-item-header">Essay 2 - Close Reading of Dickinson</h4>
                                    <p className="as-single-date">Due Sep 26, 11:59pm</p>
                                    <div className="assignment-single-lower">
                                        <p className="single-lower-status" style={{backgroundColor: StatusColor(1)}}>DUE</p>
                                        <button className="single-lower-submit">Hand In</button>
                                    </div>
                                    <div className="assignment-divider"></div>
                                </div>
                                {canEdit &&
                                    <div className="assignment-create">
                                        <button className="add-assignment-popup-btn" onClick={() => setIsAddAssignmentComp(!isAddAssignmentComp)}>Add Assignment</button>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="detail-lecture">
                            <h3 className="lecture-header">Lectures</h3>
                            <div className="lecture-list">
                                {/* MAP OVER LECTURES AND MAKE ONE OF THESE DIVS FOR EACH */}
                                <button className="lecture-card" onClick={() => lectureDisplay({
                                                                                    Id: 1,
                                                                                    Date: "Sep 29 2026",
                                                                                    Title: "Coding 101",
                                                                                    Status: 1,
                                                                                    Subject: "OOP",
                                                                                    Content: "Object oriented Programming is some of the best programming"
                                                                                })}>
                                    <div className="lecture-card-info">
                                        <p className="lecture-date">Sep 29</p>
                                        <h4 className="detail-item-header">Coding 101</h4>
                                        <p className="lecture-subject">Subject of this lecture</p>
                                    </div>
                                </button>
                                {canEdit && 
                                    <div className="lecture-create">
                                        <button className="add-lecture-popup-btn" onClick={() => setIsAddLectureComp(!isAddLectureComp)}>Add Lecture</button>
                                    </div>
                                }
                            </div>
                            

                            
                        </div>
                    </div>
                    {lectureToggle && 
                        <div className="detail-lecture-output">
                            <h2 className="lecture-output-heading">Lecture:</h2>
                            <p className="lecture-output">{lectureOutput?.Content}</p>
                        </div>
                    }
                    {isAddLectureComp && <AddLectureComp onClose={() => setIsAddLectureComp(false)}/>}
                    {isAddAssignmentComp && <AddAssignmentComp onClose={() => setIsAddAssignmentComp(false)}/>}
                    {isAddStudentComp && <AddStudentComp onClose={() => setIsAddStudentComp(false)}/>}
                </div>
        </section>
    )
}