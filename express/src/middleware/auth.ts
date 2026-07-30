import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface TokenPayload{
    user_id:number;
    role: "teacher" | 'student';
    student_id: number | null;
    teacher_id: number | null;
}

//Must import in tandom with the requireAuth
export interface AuthRequest extends Request{
    user?: TokenPayload;
}

//Test their Auth
export const requireAuth = function(req:AuthRequest, res:Response, next: NextFunction){
    //Read the session from the HttpOnly cookie set at login
    const token = req.cookies?.token ?? null;

    if(!token){
        res.status(401).json({success: false, message:"Invalid Authentication"});
        return;
    }

    const secret = process.env.JWT_SECRET;
    if(!secret){
        console.error("Failed Token Creation.")
        res.status(500).json({success:false, message: "Server error."});
        return;
    }
    try{
        req.user = jwt.verify(token,secret) as TokenPayload;
        next();
    }catch(error){
        res.status(401).json({success:false,message:"Invalid/Expired session."})
    }
    
}