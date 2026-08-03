import pool from "../db";
import {RowDataPacket, ResultSetHeader} from "mysql2";

//basically confirms that the current teacher user owns the class they are trying to add a class to, before writing any information. This is to ensure that a teacher cannot accidentally write a lecture to a course they aren't teaching.
export const classBelongsToTeacher = async(classId: string, teacherId: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT class_id
        FROM class
        WHERE class_id = ?
            AND teacher_teacher_id = ?
        LIMIT 1
        `, [classId, teacherId]);
        return rows.length > 0; //function returns true or false based on whether or not the selected class belongs to teacher or not. 
}

//no id is needed because the id for lecture table is auto increment.
export const createLecture = async(classId: string, content: string, date: string, durationHours: number | null) => {
    const [result] = await pool.query<ResultSetHeader>(`
        INSERT INTO lecture(date, duration_hours, content, class_class_id)
        VALUES (?,?,?,?)
        `, [date, durationHours, content, classId])
        return result.insertId;
}