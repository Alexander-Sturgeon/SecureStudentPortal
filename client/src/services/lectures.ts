const API_URL = "http://localhost:3000";

export interface AddLectureResult {
    status: number;
    success: boolean;
    message: string | null;
}

export const AddLecture = async(classId: string, content: string): Promise<AddLectureResult> => {
    //classId goes in url
    const response = await fetch(`${API_URL}/api/classes/${classId}/lectures`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json"},
        //only the content is sent in the body, no teacherId. TeacherId comes off the cookie in the server, which is what makes this secure. 
        body: JSON.stringify({content}) 
    });

    const body = await response.json();

    //return status same as serverice auth.ts, three potential failure points here in the backend. 
    return {status: response.status, success: body.success ?? false, message: body.message ?? null};
}