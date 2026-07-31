import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

//Uploads live outside src and are never served as static files, so a file that
//slips through cannot be requested back by url and run.
const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const MAX_FILE_BYTES = 10 * 1024 * 1024;

//Mime type mapped to the extension the stored file will be given.
//The name and extension the browser sends are thrown away.
const ALLOWED_TYPES = new Map<string, string>([
    ["application/pdf", ".pdf"],
    ["application/msword", ".doc"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"]
]);

if(!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        //A generated name stops path traversal (../../src/server.ts) and
        //double extensions (essay.pdf.php) in one step.
        const extension = ALLOWED_TYPES.get(file.mimetype) ?? "";
        cb(null, `${crypto.randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_BYTES, files: 1 },
    fileFilter: (req, file, cb) => {
        //mimetype is a claim made by the client, so this catches honest
        //mistakes. The generated name and the unserved folder are what make
        //a lie about the type harmless.
        if(!ALLOWED_TYPES.has(file.mimetype)){
            cb(new Error("Only PDF and Word documents are accepted."));
            return;
        }
        cb(null, true);
    }
}).single("file");

//multer reports problems by calling back with an error. Without this wrapper an
//oversized file would surface as a generic 500 instead of saying what is wrong.
export const uploadSubmission = function(req: Request, res: Response, next: NextFunction){
    upload(req, res, (error) => {
        if(error instanceof multer.MulterError){
            if(error.code === "LIMIT_FILE_SIZE"){
                res.status(413).json({success: false, message: "File must be 10MB or smaller."});
                return;
            }
            res.status(400).json({success: false, message: "Upload rejected."});
            return;
        }
        if(error){
            res.status(400).json({success: false, message: error.message});
            return;
        }
        next();
    });
}

//Multer writes the file before the controller runs, so anything that rejects
//the request afterwards has to clean up or unauthorised callers could fill
//the disk.
export const RemoveUpload = function(filePath: string | undefined){
    if(!filePath){ return; }

    fs.unlink(filePath, (error) => {
        if(error){ console.error("Could not remove rejected upload: ", error); }
    });
}
