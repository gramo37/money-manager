import { Response, NextFunction } from "express";
import { AppError, catchAsync } from "../utils/errorHandler";
import { authenticatedUserRequest } from "../middleware/isAuthenticated";
import ExpenseModel from "../schemas/ExpenseSchema";
import CategoryModel from "../schemas/CategorySchema";
import {
  createExpenseValidationSchema,
  updateExpenseValidationSchema,
  getAllExpenseValidationSchema,
} from "../validation/expenseValidation";
import ExpenseSchema from "../schemas/ExpenseSchema";
import { addDaysToDate, addMonthsToDate, addYearsToDate } from "../utils";

export const getAllExpenses = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { error } = getAllExpenseValidationSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    let { skip, limit, time_period, starting_date, quantity } = req.body;

    if (!skip) skip = 0;
    if (!limit) limit = 100;
    if (!time_period) time_period = "month";
    if (!quantity) quantity = 1;

    const startDate = starting_date ? new Date(starting_date) : new Date();
    let endDate: Date;

    switch (time_period) {
      case "day":
        endDate = addDaysToDate(startDate, quantity);
        break;
      case "year":
        endDate = addYearsToDate(startDate, quantity);
        break;
      default:
        endDate = addMonthsToDate(startDate, quantity);
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.log(startDate, endDate);
      return next(new AppError("startDate or endDate wrong", 500));
    }

    const analysis = await ExpenseModel.aggregate([
      // Step 1: Match expenses for the given user and date range
      {
        $match: {
          userId: req.user._id,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      // Step 2: Lookup category details
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      // Step 3: Unwind the categoryDetails array (since $lookup returns an array)
      {
        $unwind: "$categoryDetails",
      },
      // Step 4: Group by category and calculate total amount
      {
        $group: {
          _id: "$categoryDetails._id",
          categoryName: { $first: "$categoryDetails.name" },
          totalAmountSpent: { $sum: "$amount" },
        },
      },
      // Step 5: Project the final output
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: 1,
          totalAmountSpent: 1,
        },
      },
    ]);

    const expenses = await ExpenseModel.find({
      userId: req.user._id,
      date: { $lte: endDate, $gte: startDate },
    })
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    res.status(201).json({
      status: "success",
      data: {
        expenses,
        analysis,
      },
    });
  }
);

export const createExpense = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { error } = createExpenseValidationSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { category, amount, date, description } = req.body;

    const db_category = await CategoryModel.findOneAndUpdate(
      { name: category.name },
      { $setOnInsert: { name: category.name } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

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
