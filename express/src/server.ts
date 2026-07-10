import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Import route files here as you build them, e.g.:
// import auth from "./routes/auth";

// cors allows requests from other origins
// express.json parses json request bodies so req.body works.
app.use(cors());
app.use(express.json());

// GET is the HTTP method
app.get("/", (req, res) => {
    res.send("Secure Student Portal API");
});

// Mount route files here as you build them, e.g.:
// app.use("/auth", auth);

// starts server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
