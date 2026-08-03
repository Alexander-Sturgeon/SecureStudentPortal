const API_URL = "http://localhost:3000";

export interface ClassDetail {
    class_id: string;
    name: string;
    teacher_name: string;
    can_edit: boolean;
}

export interface Assignment {
    assignment_id: number;
    due_date: string;
    status: string;
    grade: string | null;
    can_submit: boolean;
}

// The status is returned instead of thrown so the page can tell the
// difference between "log in again" (401) and "no such class" (404).
export interface ClassDetailResult {
    status: number;
    data: ClassDetail | null;
    assignments: Assignment[];
}

export interface ClassListItem {
    class_id: string;
    name: string;
    teacher_name: string;
    assignment_count: number;
    lecture_count: number;
}

export const GetClasses = async (): Promise<ClassListItem[]> => {
    const response = await fetch(`${API_URL}/api/classes`, {
        credentials: "include"
    });

    if(!response.ok){
        return [];
    }

    const body = await response.json();
    return body.classes ?? [];
}

export const GetClassDetail = async (classId: string): Promise<ClassDetailResult> => {
    // credentials include sends the HttpOnly session cookie. The token is not
    // readable from javascript, so there is no header to build here.
    const response = await fetch(`${API_URL}/api/classes/${classId}`, {
        credentials: "include"
    });

    if(!response.ok){
        return { status: response.status, data: null, assignments: [] };
    }

    const body = await response.json();
    return { status: response.status, data: body.class, assignments: body.assignments ?? [] };
}
