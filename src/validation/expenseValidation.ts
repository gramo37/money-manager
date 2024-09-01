import Joi from "joi";

export const getAllExpenseValidationSchema = Joi.object({
  skip: Joi.number(),
  limit: Joi.number(),
  starting_date: Joi.string(),
  time_period: Joi.string(),
  quantity: Joi.number(),
});

export const createExpenseValidationSchema = Joi.object({
  date: Joi.string().isoDate(),
  description: Joi.string().required(),
  amount: Joi.number().required(),
  category: {
    name: Joi.string().required(),
    description: Joi.string(),
  },
});

export const updateExpenseValidationSchema = Joi.object({
  date: Joi.string().isoDate(),
  description: Joi.string(),
  amount: Joi.number(),
  category: {
    name: Joi.string(),
    description: Joi.string(),
  },
});