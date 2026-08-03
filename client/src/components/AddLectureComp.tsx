import {useState} from "react";
import {AddLecture} from "../services/lectures";

interface AddLectureProps{
    classId: string;
    onClose: () => void;
}

//classid sent as prop 
export default function AddLectureComp({classId, onClose} : AddLectureProps){
    const[content, setContent] = useState("");
    const[message, setMessage] = useState("");

    const HandleSubmit = async(e: React.FormEvent) =>{
        e.preventDefault();
        setMessage("");

        const result = await AddLecture(classId, content);

        if(result.success){
            onClose();
            return;
        }

        setMessage(result.message ?? "Could not add lecture.");
    }


    return(
        //Clicking the backdrop closes
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation keeps clicks inside the panel from closing it */}
            <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                <form className="modal-form" onSubmit={HandleSubmit}>
                    <label className="modal-heading">Lecture Body:</label>
                    <textarea rows={5} cols={20} placeholder="Enter Lecture Here..."  minLength={25} value={content} onChange={(e)=> setContent(e.target.value)}/>
                    <button className="modal-submit" type="submit">Add Lecture</button>

                    {message && <p className="modal-message">{message}</p>}
                </form>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
