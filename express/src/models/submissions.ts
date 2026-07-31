import pool from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface AssignmentAccess extends RowDataPacket{
    assignment_id: number;
    due_date: Date;
}

//Returns the assignment ONLY if this student is enrolled in the class that
//owns it. An assignment that does not exist and one belonging to another
//class both return null, so this cannot be used to probe assignment ids.
export const findAssignmentForStudent = async(assignmentId: number, studentId: number) => {
    const [rows] = await pool.query<AssignmentAccess[]>(`
        SELECT a.assignment_id, a.due_date
        FROM assignment a
        JOIN student_has_class shc
            ON shc.class_class_id = a.class_class_id
        WHERE a.assignment_id = ?
          AND shc.student_student_id = ?
        LIMIT 1
    `, [assignmentId, studentId]);
    return rows[0] ?? null;
}

//The primary key is (student, assignment), so resubmitting before the due date
//updates the existing row instead of failing on a duplicate key.
export const saveSubmission = async(studentId: number, assignmentId: number, filePath: string, notes: string | null) => {
    const [result] = await pool.query<ResultSetHeader>(`
        INSERT INTO student_has_assignment
            (student_student_id, assignment_assignment_id, file_path, notes)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE file_path = VALUES(file_path), notes = VALUES(notes)
    `, [studentId, assignmentId, filePath, notes]);
    return result;
}
