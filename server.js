import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

//Load environment variables
dotenv.config();

//Connect to MongoDB
connectDB();

//Start express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
