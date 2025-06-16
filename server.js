import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";

//Load environment variables
dotenv.config();

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ");

    //Start express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
