const API_URL = "http://localhost:3000";

export interface SubmitResult {
    status: number;
    message: string;
}

export const SubmitAssignment = async (assignmentId: number, data: FormData): Promise<SubmitResult> => {
    // Content-Type is deliberately not set here. The browser has to generate
    // the multipart boundary itself, and setting the header by hand breaks it.
    const response = await fetch(`${API_URL}/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        credentials: "include",
        body: data
    });

    const body = await response.json().catch(() => ({}));
    return {
        status: response.status,
        message: body.message ?? "Upload failed."
    };
}
