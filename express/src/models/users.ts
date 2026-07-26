import pool from "../db";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User extends RowDataPacket{
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    student_id: number | null;
    teacher_id: number | null;
}

export const findByEmail = async(email: string) => {
    const [rows] = await pool.query<User[]>(`
        SELECT
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.password_hash, 
            s.student_id,
            t.teacher_id
        FROM user u
        LEFT JOIN student s ON s.User_user_id = u.user_id
        LEFT JOIN teacher t ON t.User_user_id = u.user_id
        WHERE u.email = ?
        LIMIT 1
        `, [email]);
    return rows[0] ?? null;
}
