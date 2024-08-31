import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorHandler";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../validation/userValidation";
import bcrypt from "bcryptjs";
import UserModel from "../schemas/UserSchema";
import { catchAsync } from "../utils/errorHandler";
import { getToken } from "../utils";

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return next(new AppError("User already exists", 409));

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    let token = getToken(name, email);

    res.status(201).json({
      status: "success",
      data: {
        token,
      },
    });
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne(
      { email },
      "name email password"
    );
    if (!existingUser) return next(new AppError("User does not exist", 404));

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch)
      return next(new AppError("Password does not match", 401));

    let token = getToken(existingUser.name, email);

    res.status(201).json({
      status: "success",
      data: {
        token,
      },
    });
  }
);
