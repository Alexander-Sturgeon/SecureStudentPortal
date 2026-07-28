interface AddStudentProps{
    onClose: () => void;
}

export default function AddStudentComp({onClose} : AddStudentProps){
    return(
        //Clicking the backdrop closes
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation keeps clicks inside the panel from closing it */}
            <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                <form className="modal-form">
                    <label className="modal-heading">Student ID Number:</label>
                    <input type="text" placeholder="Enter Student ID..." minLength={9} maxLength={9}/>
                    <button className="modal-submit" type="submit">Add Student</button>
                </form>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
