import pool from "../db";
import {ResultSetHeader} from "mysql2";

//event names same as constants to prevent typos
export const LogEvent = {
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILED: "LOGIN_FAILED",
    LOGOUT: "LOGOUT",
    ACCESS_DENIED: "ACCESS_DENIED",
    LECTURE_CREATED: "LECTURE_CREATED",
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED"
} as const;

export const Severity = {
    INFO: "INFO",
    WARNING: "WARNING",
    CRITICAL: "CRITICAL"
} as const;

//masks personal data before logging
export const maskEmail = (email: string) => {
    const at = email.indexOf("@"); //checks where @ is in email; makes sure user didn't 
    if(at < 1){return "***";} //checks if @ is missing or at position 0
    return `${email[0]}***${email.slice(at)}`;
}


//error handling local to this model to avoid breaking requests it is attempting to log. No timestamp is sent by the server as the mysql uses default current timestamp.
export const writeLog = async(action: string, severity: string, outcome: string, ipAddress: string | null, userId: number | null) => {
    try{ 
        await pool.query<ResultSetHeader>(`
            INSERT INTO security_logs(action, severity, outcome, ip_address, user_user_id)
            VALUES (?,?,?,?,?)
            `, [action, severity, outcome, ipAddress, userId]);
    }catch(error){
        console.error("Failed to write security log: ", error);
    }
}

