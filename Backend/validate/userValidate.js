import * as yup from "yup";

export const userSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .min(3, "User name must be at least 3 characters long")
    .required("User name is required"),

  email: yup
    .string()
    .email("The email is not valid")
    .required("Email is required"),

  password: yup
    .string()
    .min(4, "Password must be at least 4 characters long")
    .required("Password is required"),
});

export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};
