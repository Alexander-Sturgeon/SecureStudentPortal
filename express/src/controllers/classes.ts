import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { findClassForUser, findAssignmentsForClass } from '../models/classes';

//A due date counts until the end of that day
const EndOfDay = function(date: Date){
    const due = new Date(date);
    due.setHours(23, 59, 59, 999);
    return due;
}

export const getClassDetail = async function(req: AuthRequest, res: Response){
    //Identity comes from the verified token, never from the request itself
    const studentId = req.user?.student_id ?? null;
    const teacherId = req.user?.teacher_id ?? null;

    const classId = typeof req.params.classId === "string" ? req.params.classId : null;

    if(!classId){
        res.status(400).json({success: false, message: "Invalid class."});
        return;
    }

    try{
        const detail = await findClassForUser(classId, studentId, teacherId);

        //Null means either no such class or no access. Same answer for both,
        //so this endpoint can't be used to find out which classes exist.
        if(!detail){
            res.status(404).json({success: false, message: "Class not found."});
            return;
        }

        const rows = await findAssignmentsForClass(classId, studentId);
        const now = new Date();

        //Status and can_submit are worked out here rather than in the browser,
        //so a wrong clock on the client cannot change a deadline.
        const assignments = rows.map(row => {
            const due = EndOfDay(row.due_date);
            const isLate = due < now;

            let status = "DUE";
            if(row.grade !== null){ status = "GRADED"; }
            else if(row.file_path !== null){ status = "SUBMITTED"; }
            else if(isLate){ status = "LATE"; }

            return {
                assignment_id: row.assignment_id,
                due_date: row.due_date,
                status,
                grade: row.grade,
                //Only a student can hand work in, and only before the deadline
                can_submit: studentId !== null && !isLate
            };
        });

        res.status(200).json({
            success: true,
            class: {
                class_id: detail.class_id,
                name: detail.name,
                teacher_name: `${detail.first_name} ${detail.last_name}`,
                can_edit: detail.can_edit === 1
            },
            assignments
        });
    }catch(error){
        console.log("You have encountered an error: ", error);
        res.status(500).json({success: false, message: "Server error."});
        return;
    }
}
