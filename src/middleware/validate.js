import { validateUser } from "../utils/validate.js";

export const validate = (type) => (req, res, next) => {
  const { errors, value } = validateUser(req.body, type);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body = value; //use sanitized and validated data
  next();
};
