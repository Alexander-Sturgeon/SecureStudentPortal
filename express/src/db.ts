import mysql from "mysql2/promise";
import "dotenv/config";

// Credentials are read from environment variables (see .env.example).
// Never commit real credentials — .env is gitignored.
const pool = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "studentportal"
});

export default pool;
