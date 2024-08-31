import Joi from "joi";

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "manager", "employee", "guest").required(),
  password: Joi.string().min(8).required(),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
