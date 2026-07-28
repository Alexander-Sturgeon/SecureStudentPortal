interface AddLectureProps{
    onClose: () => void;
}

export default function AddLectureComp({onClose} : AddLectureProps){
    return(
        //Clicking the backdrop closes
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation keeps clicks inside the panel from closing it */}
            <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                <form className="modal-form">
                    <label className="modal-heading">Lecture Body:</label>
                    <textarea rows={5} cols={20} placeholder="Enter Lecture Here..."  minLength={25}/>
                    <button className="modal-submit" type="submit">Add Lecture</button>
                </form>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
