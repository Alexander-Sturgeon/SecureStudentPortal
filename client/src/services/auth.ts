const API_URL = "http://localhost:3000";

//what the login function returns
export interface LoginResult {
    status: number;
    success: boolean;
    message: string | null;
}

//email and string values obtained from login form. Essentially a post request to the backend. 
export const Login = async(email: string, password: string): Promise<LoginResult> => {

    //fetch request to the backend specifying http verb, metadata, body, credentials, etc.
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });

    const body = await response.json();
    
    //returns status, success boolean and a message
    return {status: response.status, success: body.success ?? false, message: body.message ?? null};
}

//Logout post request to the backend. This is what calls the logout controller auth function in the backend which sends back an expired cookie which causes the browser to delete its copy of the session. credential include needed to set and accept cookies on the browser. 
export const Logout = async (): Promise<boolean> => {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    return response.ok;
}

