import {Response} from 'express';
import {AuthRequest} from '../middleware/auth';
import { classBelongsToTeacher, createLecture } from '../models/lectures';

export const addLecture = async function(req: AuthRequest, res: Response){
    //reads teacherId from req.user. This is set after verifiying the token is the valid, current token, by requireAuth, and is seperate form the request body. 
    const teacherId = req.user?.teacher_id ?? null;
    const classId = typeof req.params.classId === "string" ? req.params.classId: null;

    //if either teacherId or classId are not valid, meaning the teacherId either wasn't sent or was sent through the req body or classId somehow results in undefined, returns a failure status 400.
    if(!teacherId || !classId){
        res.status(400).json({success: false, message: "Invalid request."});
        return;
    }

    //basically the same check as classId, makes sure its not undefined. Typeof check forces it to be a string.
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

    //ensures content has minimum length.
    if(content.length < 25){
        res.status(400).json({success: false, message: "Lecture content must at least be 25 characters."});
        return;
    }

    try{
        //implementation of the teacher/class check function from lecture model. If teacher isn't teaching class then they can't access it. 
        const owns = await classBelongsToTeacher(classId, teacherId);
        
        if(!owns){
            res.status(403).json({success: false, message: "forbidden"});
            return;
        }

        //Formats the date into layout that db can use.
        const today = new Date().toLocaleDateString("en-CA");

        //Creates lecture based on collected data and returns the id of the lecture that was created. 
        const lectureId = await createLecture(classId, content, today, null);

        res.status(201).json({success: true, lecture_id: lectureId});
    }catch(error){
        console.error("Failed to create lecture: ", error);
        res.status(500).json({success: false, message: "Server error."});
        return;
    }
}