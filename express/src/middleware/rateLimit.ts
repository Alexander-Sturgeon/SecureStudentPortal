import rateLimit from "express-rate-limit";
import {writeLog, LogEvent, Severity} from '../models/logs';

//protects server from brute force cyber attacks. Login limiter events should be logged. 
export const loginLimiter = rateLimit({
    //time window in miliseconds. Counter resets after 15 minutes.
    windowMs: 15 * 60 * 1000, 

    //max attempts per ip.
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false, 

    //this is the only section where a brute force attempt would be visible. 
    handler: async(req,res) => {
        await writeLog(`${LogEvent.RATE_LIMIT_EXCEEDED} login`, Severity.CRITICAL, "FAILURE", req.ip ?? null, null);
        res.status(429).json({success: false, message: "Too many login attempts. Please try again later."})
    }
});