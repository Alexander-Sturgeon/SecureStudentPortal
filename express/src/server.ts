import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

//Instructions for env setup after patch
//run: npm install dotenv
//touch ~/express/.env

// Import route files here
import auth from "./routes/auth";
import classes from "./routes/classes";
//The session cookie is sent automatically by the browser
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
}));
//express.json parses json request bodies so req.body works.
app.use(express.json());
//cookieParser fills req.cookies so requireAuth can read the session
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Secure Student Portal API");
});

// Mount route files here
app.use("/api/auth", auth);
app.use("/api/classes", classes);

// starts server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
