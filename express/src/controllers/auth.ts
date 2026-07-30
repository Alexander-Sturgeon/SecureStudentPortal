import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {findByEmail} from '../models/users';

export const login = async function(req: Request, res: Response){
    const {email, password} = req.body
    try{
        const user = await findByEmail(email)

        if(!user){
            //This should create a failure log. Future Implementation.
            res.status(401).json({success:false, message: "Invalid email or password"});
            return
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            //This should create a failure log. Future Implementation.
            res.status(401).json({success: false, message: "Invalid email or password"});
            return;
        }

        const secret = process.env.JWT_SECRET;
        if(!secret){
            console.error("JWT_SECRET undefined");
            res.status(500).json({success: false, message: "Server error."});
            return;
        }

        const role = user.teacher_id !== null ? "teacher" : "student";

        const token = jwt.sign(
            {
            user_id: user.user_id, role,
            student_id: user.student_id,
            teacher_id: user.teacher_id
            },
            secret, 
            {expiresIn: "1hr"}
        );

        //The token goes in an HttpOnly cookie so page scripts cannot read it,
        //which keeps an XSS payload from stealing the session.
        //secure is off in development because localhost is served over http.
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        //The token is deliberately not in the body, the cookie is the only copy
        res.status(200).json({success: true})
    }catch(error){
        console.log("You have encountered an error: ", error)
        res.status(500).json({success: false, message: "Server error."});
        return;
    }
}