import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../db/db.connection.js";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async ({ username, email, password }) => {
  try {
    const existingUser = await pool.query(
      'SELECT id FROM "Users" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO "Users" (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    const userId = result.rows[0].id;
    const token = generateToken(userId);

    return { token };
  } catch (err) {
    throw err;
  }
};

const login = async ({ username, password }) => {
  try {
    const result = await pool.query(
      'SELECT id, password FROM "Users" WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return { token };
  } catch (err) {
    throw err;
  }
};

export { register, login };