import { login as authLogin } from "./auth.service.js";
import { register as authRegister } from "./auth.service.js";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.connection.js";

const login = async (username, password) => {
  const result = await authLogin(username, password);

  return result;
};

const register = async (username, email, password) => {
  const result = await authRegister(username, email, password);

  return result;
};

const getUserIdByToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded || !decoded.id) {
    throw new Error('Invalid token');
  }
  
  const result = await pool.query(
    'SELECT id FROM "Users" WHERE id = $1',
    [decoded.id]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0].id;
};

const getUserProfile = async (token) => {
  const userId = await getUserIdByToken(token);

  const result = await pool.query(
    'SELECT id, username, email FROM "Users" WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return { ...result.rows[0] };
};

export { login, register, getUserIdByToken, getUserProfile };