interface AddAssignmentProps{
    onClose: () => void;
}

export default function AddAssignmentComp({onClose} : AddAssignmentProps){
    return(
        // Clicking the backdrop closes; stopPropagation keeps clicks inside the panel from closing it
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                <form className="modal-form">
                    <label className="modal-heading">Assignment Body:</label>
                    <textarea rows={5} cols={20} placeholder="Enter Assignment Ask Here..."  minLength={25}/>
                    <button className="modal-submit" type="submit">Add Assignment</button>
                </form>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
