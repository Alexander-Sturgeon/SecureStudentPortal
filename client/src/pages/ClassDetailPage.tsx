import { Link, useParams } from "react-router-dom"
import '../styles/ClassDetailPage.css';
import { useState } from "react";

interface Lecture {
      Id: number;
      Date: string;
      Title: string;
      Status: number;
      Subject: string;
      Content: string;    
  }
export default function ClassDetailPage(){
    //This is passing the id of the class but for UI rough in just hardcoding values
    const {id} = useParams();
    const [lectureOutput, setLectureOutput] = useState<Lecture | null>(null);
    const [lectureToggle, setLectureToggle] = useState(false);
    const lectureDisplay = (lecture : Lecture) =>{
        setLectureToggle(true)
        setLectureOutput(lecture)
    }
    function StatusColor(status : number){
        switch(status){
            case 1: return 'yellow';
            case 2: return 'red';
            case 3: return 'gray';
            default: return 'blue';
        }
        
    }
    
    return(
        <section className="detail-body">
            <div className="detail-back-btn"><Link to={`/classes`} className="assignment-nav" aria-label='Navigate to Class List'>{'<<'} Back to My Classes</Link></div>
            <div className="detail-header">
                <p>Fall 2026</p>
                <h1>ENGL 201 - Modern Poetry</h1>
                <p>Alexander Sturgeon</p>
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
                    </div>
                    

                    
                </div>
            </div>
            {lectureToggle && 
                <div className="detail-lecture-output">
                    <h2 className="lecture-output-heading">Lecture:</h2>
                    <p className="lecture-output">{lectureOutput?.Content}</p>
                </div>
            }
            
        </section>
    )
}