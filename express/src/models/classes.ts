import pool from "../db";
import { RowDataPacket } from "mysql2";

export interface ClassDetail extends RowDataPacket{
    class_id: string;
    name: string;
    first_name: string;
    last_name: string;
    can_edit: number;
}

export interface LectureRow extends RowDataPacket{
    lecture_id: number;
    date: Date;
    duration_hours: number | null;
    content: string;
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

export interface ClassListRow extends RowDataPacket{
    class_id: string;
    name: string;
    first_name: string;
    last_name: string;
    assignment_count: number;
    lecture_count: number;
}

//Returns every class the caller is enrolled in (student) or teaches (teacher).
//Same null-safe pattern as findClassForUser - whichever id is null is ignored.
export const findClassesForUser = async(studentId: number | null, teacherId: number | null) => {
    const [rows] = await pool.query<ClassListRow[]>(`
        SELECT
            c.class_id,
            c.name,
            u.first_name,
            u.last_name,
            (SELECT COUNT(*) FROM assignment a WHERE a.class_class_id = c.class_id) AS assignment_count,
            (SELECT COUNT(*) FROM lecture l WHERE l.class_class_id = c.class_id) AS lecture_count
        FROM class c
        JOIN teacher t ON t.teacher_id = c.teacher_teacher_id
        JOIN user u ON u.user_id = t.User_user_id
        LEFT JOIN student_has_class shc
            ON shc.class_class_id = c.class_id
           AND shc.student_student_id <=> ?
        WHERE shc.student_student_id IS NOT NULL OR c.teacher_teacher_id <=> ?
    `, [studentId, teacherId]);
    return rows;
}

export interface AssignmentRow extends RowDataPacket{
    assignment_id: number;
    due_date: Date;
    file_path: string | null;
    grade: string | null;
}

//Access to the class itself must already have been proven with
//findClassForUser before this runs, so this query does not re-check it.
//The submission join is still scoped to one student, which is what stops a
//student from seeing another student's file or grade.
export const findAssignmentsForClass = async(classId: string, studentId: number | null) => {
    const [rows] = await pool.query<AssignmentRow[]>(`
        SELECT
            a.assignment_id,
            a.due_date,
            sha.file_path,
            sha.grade
        FROM assignment a
        LEFT JOIN student_has_assignment sha
            ON sha.assignment_assignment_id = a.assignment_id
           AND sha.student_student_id <=> ?
        WHERE a.class_class_id = ?
        ORDER BY a.due_date
    `, [studentId, classId]);
    return rows;
}

//class access is checked by findClassForUser before this runs, so it doesn't need to be rechecked. Returns all rows for the lectures for the given class. 
export const findLectureForClass = async(classId: string) => {
    const [rows] = await pool.query<LectureRow[]>(`
        SELECT lecture_id, date, duration_hours, content
        FROM lecture
        WHERE class_class_id = ?
        ORDER BY date
        `, [classId]);
        return rows;
}

