import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET_KEY ?? "SECRET_KEY";

export function getToken(name: string, email: string) {
  let token = jwt.sign(
    {
      name,
      email,
    },
    SECRET
  );
  return token;
}
