import { login as authLogin } from "./auth.service.js";
import { register as authRegister } from "./auth.service.js";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.connection.js";

const login = async (data) => {
  const result = await authLogin(data);

  return result;
};

const register = async (data) => {
  const result = await authRegister(data);

  return result;
};

const getUserByToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  const result = await pool.query(
    'SELECT id, username, email, "createdAt", "updatedAt" FROM "Users" WHERE id = $1',
    [decoded.id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


export { login, register, getUserByToken };