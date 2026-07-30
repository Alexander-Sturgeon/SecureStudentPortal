import pool from "../db";
import { RowDataPacket } from "mysql2";

export interface ClassDetail extends RowDataPacket{
    class_id: string;
    name: string;
    first_name: string;
    last_name: string;
    can_edit: number;
}

//Returns the class ONLY if the caller is enrolled in it or teaches it.
//Anyone else gets null, which the controller turns into a 404.
export const findClassForUser = async(classId: string, studentId: number | null, teacherId: number | null) => {
    const [rows] = await pool.query<ClassDetail[]>(`
        SELECT
            c.class_id,
            c.name,
            u.first_name,
            u.last_name,
            (c.teacher_teacher_id <=> ?) AS can_edit
        FROM class c
        JOIN teacher t ON t.teacher_id = c.teacher_teacher_id
        JOIN user u ON u.user_id = t.User_user_id
        LEFT JOIN student_has_class shc
            ON shc.class_class_id = c.class_id
           AND shc.student_student_id <=> ?
        WHERE c.class_id = ?
          AND (shc.student_student_id IS NOT NULL OR c.teacher_teacher_id <=> ?)
        LIMIT 1
    `, [teacherId, studentId, classId, teacherId]);
    return rows[0] ?? null;
}
