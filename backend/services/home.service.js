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
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      const err = new Error("Invalid token");
      err.status = 401;
      throw err;
    }

    const result = await pool.query(
      'SELECT id FROM "Users" WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      const err = new Error("User not found");
      err.status = 401;
      throw err;
    }

    return result.rows[0].id;
  } catch (e) {
    // JWT expired or invalid signature
    const err = new Error("Token expired or invalid");
    err.status = 401;
    throw err;
  }
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