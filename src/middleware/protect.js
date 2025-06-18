import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    // Reads JWT from cookie
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token" });
    }

    // Verifies it with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Finds user by ID in the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // Attaches user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error: ", error);
    res.status(401).json({ message: "Unauthorized, token failed" });
  }
};

export default protect;
