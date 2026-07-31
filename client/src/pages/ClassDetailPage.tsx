import { Link, useParams, Navigate } from "react-router-dom"
import { useState, useEffect } from "react";
import '../styles/ClassDetailPage.css';

import { GetClassDetail } from "../services/classes";
import type { ClassDetail, Assignment } from "../services/classes";
import { SubmitAssignment } from "../services/submissions";

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
    const {id} = useParams();
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(true);
    const [uploadMessage, setUploadMessage] = useState("");

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
    const LoadClass = (classId : string) => {
        //The api only answers for a class this user is enrolled in or teaches
        return GetClassDetail(classId)
            .then(result => {
                setStatus(result.status);
                setClassDetail(result.data);
                setAssignments(result.assignments);
            })
            .catch(() => setStatus(0))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if(!id){ return; }
        LoadClass(id);
    }, [id]);

    const HandIn = async (event : React.FormEvent<HTMLFormElement>, assignmentId : number) => {
        event.preventDefault();
        const form = event.currentTarget;

        setUploadMessage("Uploading ...");
        const result = await SubmitAssignment(assignmentId, new FormData(form));
        setUploadMessage(result.message);

        //Reload so the status badge reflects what the server actually stored
        if(result.status === 201){
            form.reset();
            if(id){ LoadClass(id); }
        }
    }

    //Color assignment for the status
    function StatusColor(status : string){
        switch(status){
            case 'LATE': return 'red';
            case 'GRADED': return 'gray';
            case 'SUBMITTED': return 'green';
            default: return 'yellow';
        }

    }

    const FormatDate = (value : string) => new Date(value).toLocaleDateString();
    
    
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
                        {/*Hardcoded as term isn't in the db scheema*/}
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
                                {assignments.length === 0 && <p className="assignment-empty">No assignments yet.</p>}
                                {assignments.map(assignment =>
                                    <div className="assignment-single" key={assignment.assignment_id}>
                                        {/*the assignment table has no title column yet*/}
                                        <h4 className="detail-item-header">Assignment {assignment.assignment_id}</h4>
                                        <p className="as-single-date">Due {FormatDate(assignment.due_date)}</p>
                                        <div className="assignment-single-lower">
                                            <p className="single-lower-status" style={{backgroundColor: StatusColor(assignment.status)}}>{assignment.status}</p>
                                            {assignment.can_submit &&
                                                <form className="single-lower-form" onSubmit={(event) => HandIn(event, assignment.assignment_id)}>
                                                    <input type="file" name="file" accept=".pdf,.doc,.docx" required/>
                                                    <button type="submit" className="single-lower-submit">Hand In</button>
                                                </form>
                                            }
                                        </div>
                                        {assignment.grade !== null && <p className="single-lower-grade">Grade: {assignment.grade}</p>}
                                        <div className="assignment-divider"></div>
                                    </div>
                                )}
                                {uploadMessage && <p className="assignment-upload-message">{uploadMessage}</p>}
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