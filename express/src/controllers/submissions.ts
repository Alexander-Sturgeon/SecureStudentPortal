import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { RemoveUpload } from '../middleware/upload';
import { findAssignmentForStudent, saveSubmission } from '../models/submissions';

export const submitAssignment = async function(req: AuthRequest, res: Response){
    //Identity comes from the verified session cookie. Taking a student id from
    //the body would let anyone submit work in someone else's name.
    const studentId = req.user?.student_id ?? null;
    const assignmentId = Number(req.params.assignmentId);

    if(!studentId){
        RemoveUpload(req.file?.path);
        res.status(403).json({success: false, message: "Only students can submit work."});
        return;
    }

    if(!Number.isInteger(assignmentId)){
        RemoveUpload(req.file?.path);
        res.status(400).json({success: false, message: "Invalid assignment."});
        return;
    }

    if(!req.file){
        res.status(400).json({success: false, message: "No file was uploaded."});
        return;
    }

    try{
        const assignment = await findAssignmentForStudent(assignmentId, studentId);

        //Null means no such assignment or not this student's class. One answer
        //for both, so the response gives nothing away.
        if(!assignment){
            RemoveUpload(req.file.path);
            res.status(404).json({success: false, message: "Assignment not found."});
            return;
        }

        //The deadline is checked against the server clock. A due date counts
        //until the end of that day.
        const due = new Date(assignment.due_date);
        due.setHours(23, 59, 59, 999);

        if(due < new Date()){
            RemoveUpload(req.file.path);
            res.status(403).json({success: false, message: "This assignment is past due."});
            return;
        }

        //Only the generated file name is stored, never the name the browser sent
        const notes = typeof req.body.notes === "string" ? req.body.notes.slice(0, 250) : null;
        await saveSubmission(studentId, assignmentId, req.file.filename, notes);

        res.status(201).json({success: true, message: "Submission received."});
    }catch(error){
        RemoveUpload(req.file.path);
        console.log("You have encountered an error: ", error);
        res.status(500).json({success: false, message: "Server error."});
        return;
    }
}
