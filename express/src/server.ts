import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

//Instructions for env setup after patch
//run: npm install dotenv
//touch ~/express/.env

// Import route files here
// import auth from "./routes/auth";

//cors allows requests from other origins
//express.json parses json request bodies so req.body works.
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Secure Student Portal API");
});

// Mount route files here
// app.use("/auth", auth);

// starts server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
