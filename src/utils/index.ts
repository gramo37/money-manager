import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const SECRET = process.env.SECRET_KEY ?? "SECRET_KEY";

export function getToken(name: string, email: string) {
  let token = jwt.sign(
    {
      data: JSON.stringify({ name, email }),
    },
    SECRET,
    { expiresIn: "1h" }
  );
  return token;
}
