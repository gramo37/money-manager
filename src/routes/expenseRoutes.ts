import express from "express";
import {
  deleteExpense,
  getAllExpenses,
  updateExpense,
  createExpense,
  getExpense
} from "../controllers/expenseController";

const expenseRouter = express.Router();

expenseRouter.route("/").get(getAllExpenses);
expenseRouter.route("/create").post(createExpense);
expenseRouter.route("/:id").get(getExpense).post(updateExpense).delete(deleteExpense);

export default expenseRouter;
