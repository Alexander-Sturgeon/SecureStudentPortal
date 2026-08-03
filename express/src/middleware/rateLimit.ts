import rateLimit from "express-rate-limit";

//protects server from brute force cyber attacks. Login limiter events should be logged. 
export const loginLimiter = rateLimit({
    //time window in miliseconds. Counter resets after 15 minutes.
    windowMs: 15 * 60 * 1000, 

    //max attempts per ip.
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false, 
    message: {
        success: false, 
        message: "Too many login attempts. Please try again later."
    }
});