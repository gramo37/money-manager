import { Response, NextFunction } from "express";
import { AppError, catchAsync } from "../utils/errorHandler";
import { authenticatedUserRequest } from "../middleware/isAuthenticated";
import ExpenseModel, { IExpense } from "../schemas/ExpenseSchema";
import CategoryModel from "../schemas/CategorySchema";
import {
  createExpenseValidationSchema,
  updateExpenseValidationSchema,
} from "../validation/expenseValidation";
import ExpenseSchema from "../schemas/ExpenseSchema";

export const getAllExpenses = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const expenses = await ExpenseModel.find({ userId: req.user._id });
    res.status(201).json({
      status: "success",
      data: {
        expenses,
      },
    });
  }
);

export const createExpense = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { error } = createExpenseValidationSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { category, amount, date, description } = req.body;
    let db_category: any = await CategoryModel.findOne({ name: category.name });
    if (!db_category) {
      try {
        db_category = await CategoryModel.create({
          name: category.name,
          description: category.description ?? "",
        });
      } catch (error) {
        console.log(error);
        next(new AppError("Something went wrong in creating category", 500));
      }
    }

    const expense = new ExpenseModel({
      userId: req.user._id,
      categoryId: db_category._id,
      amount,
      date: new Date(date) ?? Date.now(),
      description,
      status: "pending",
    });

    await expense.save();
    res.status(201).json({
      status: "success",
      data: {
        expense,
      },
    });
  }
);

export const getExpense = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const expense = await ExpenseSchema.findById(id);
    if (!expense) return next(new AppError("Expense Not Found!", 404));
    res.status(201).json({
      status: "success",
      expense,
    });
  }
);

export const updateExpense = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { error } = updateExpenseValidationSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { id } = req.params;
    const { category, amount, date, description } = req.body;
    let db_category: any;
    if (category && category.name) {
      db_category = await CategoryModel.findOne({ name: category.name });
      if (!db_category) {
        try {
          db_category = await CategoryModel.create({
            name: category.name,
            description: category.description ?? "",
          });
        } catch (error) {
          console.log(error);
          next(new AppError("Something went wrong in creating category", 500));
        }
      }
    }

    let updateTo: any = {};

    if (db_category) updateTo["categoryId"] = db_category._id;
    if (amount) updateTo["amount"] = amount;
    if (date) updateTo["date"] = date;
    if (description) updateTo["description"] = description;

    const expense = await ExpenseSchema.findByIdAndUpdate(id, updateTo, {
      returnDocument: "after",
    });
    if (!expense) return next(new AppError("Expense Not Found!", 404));

    res.status(201).json({
      status: "success",
      expense,
    });
  }
);

export const deleteExpense = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deleted = await ExpenseModel.findByIdAndDelete(id);

    if (!deleted) return next(new AppError("Expense Not Found!", 404));

    res.status(200).json({
      status: "success",
    });
  }
);
