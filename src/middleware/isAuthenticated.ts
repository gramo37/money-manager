import { AppError, catchAsync } from "../utils/errorHandler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils";
import UserModel, { IUser } from "../schemas/UserSchema";

export interface authenticatedUserRequest extends Request { user: IUser }

export const isAuthenticated = catchAsync(
  async (req: authenticatedUserRequest, res: Response, next: NextFunction) => {
    const { token } = req.headers;

    if (!token || typeof token !== "string")
      return next(new AppError("User not logged in!", 401));

    const decoded: any = jwt.verify(token, SECRET);
    const { email } = JSON.parse(decoded.data ?? "{}");
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) return next(new AppError("Unauthorized User", 401));

    req.user = existingUser;

    next();
  }
);
