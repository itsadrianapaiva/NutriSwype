import express from "express";
import cors from "cors";

const app = express();

//Middleware 
app.use(cors());
app.use(express.json());

//Test route
app.get('/api/ping', (req, res) => {
    res.json({ message: "pong" });
})

export default app
