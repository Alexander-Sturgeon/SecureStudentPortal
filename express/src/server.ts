import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

//Instructions for env setup after patch
//run: npm install dotenv
//touch ~/express/.env

// Import route files here
import auth from "./routes/auth";
import { requireAuth, AuthRequest } from "./middleware/auth";
//cors allows requests from other origins
//express.json parses json request bodies so req.body works.
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Secure Student Portal API");
});

//--Test Auth Block--
app.get("api/test-auth", (req:AuthRequest, res) => res.json({user: req.user}));
//auth
app.get("/api/test-auth", requireAuth, (req: AuthRequest,res) => res.json({user:req.user}));
// Mount route files here
app.use("/api/auth", auth);
//--Test Auth Block

// starts server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
