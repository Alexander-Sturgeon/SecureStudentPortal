import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {findByEmail} from '../models/users';
import {writeLog, maskEmail, LogEvent, Severity} from '../models/logs';

export const logout = async function(req: Request, res: Response){

    //this bit is basically just for checking the users cookie, as requireAuth doesn't run before logout does. Logout can't have requireAuth run first because that stops the request if the token is bad, which can happen after a long session. This is only for the logging functionality, basically just pulls the userId from the token to use in the log. 
    const ip = req.ip ?? null;
    let userId: number | null = null;

    const token = req.cookies?.token;
    const secret = process.env.JWT_SECRET;
    if(token && secret){
        try{
            const payload = jwt.verify(token, secret) as {user_id: number};
            userId = payload.user_id;
        }catch{
            userId = null;
        }
    }


    //Essentially clears the cookie by sending a new cookie containing the current session's cookie name, path, domain, secure, and samesite details back to the browser but with a date set in the past. This causes the their current session cookie to expire, meaning it is no longer valid. 
    res.clearCookie("token", {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    await writeLog(`${LogEvent.LOGOUT}`, Severity.INFO, "SUCCESS", ip, userId);

    res.status(200).json({success: true, message: "Logged Out User Successfully."})
}

export const login = async function(req: Request, res: Response){
    const {email, password} = req.body
    const ip = req.ip ?? null;
    const maskedEmail = typeof email === "string" ? maskEmail(email) : "***";


    try{
        const user = await findByEmail(email)

        if(!user){
            await writeLog(`${LogEvent.LOGIN_FAILED} ${maskedEmail}`, Severity.WARNING, "FAILURE", ip, null);

            res.status(401).json({success:false, message: "Invalid email or password"});
            return
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch){
            await writeLog(`${LogEvent.LOGIN_FAILED} ${maskedEmail}`, Severity.WARNING, "FAILURE", ip, user.user_id)

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

        await writeLog(LogEvent.LOGIN_SUCCESS, Severity.INFO, "SUCCESS", ip, user.user_id);

        //The token is deliberately not in the body, the cookie is the only copy
        res.status(200).json({success: true})
    }catch(error){
        console.error("You have encountered an error: ", error)
        res.status(500).json({success: false, message: "Server error."});
        return;
    }
}