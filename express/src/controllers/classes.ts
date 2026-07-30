import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { findClassForUser } from '../models/classes';

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

        res.status(200).json({
            success: true,
            class: {
                class_id: detail.class_id,
                name: detail.name,
                teacher_name: `${detail.first_name} ${detail.last_name}`,
                can_edit: detail.can_edit === 1
            }
        });
    }catch(error){
        console.log("You have encountered an error: ", error);
        res.status(500).json({success: false, message: "Server error."});
        return;
    }
}
