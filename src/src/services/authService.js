const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createId } = require("../utils/id");
const env = require("../config/env");
const HttpError = require("../utils/httpError");
const {
  createUser,
  findUserByEmail,
  savePasswordResetToken,
  findPasswordResetToken,
  deletePasswordResetToken,
  updateUserPassword,
} = require("../models/userModel");

function buildToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new HttpError(400, "name, email and password are required");
  }
  const existingUser = findUserByEmail(email);
  if (existingUser) throw new HttpError(409, "Email is already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ name, email, passwordHash });
  const token = buildToken(user);

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

async function login({ email, password }) {
  if (!email || !password) throw new HttpError(400, "email and password are required");
  const user = findUserByEmail(email);
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const token = buildToken(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

function forgotPassword({ email }) {
  if (!email) throw new HttpError(400, "email is required");
  const user = findUserByEmail(email);
  if (!user) return { message: "If account exists, reset token generated" };

  const token = createId("reset");
  savePasswordResetToken(user.email, token);
  return { message: "Reset token generated", resetToken: token };
}

async function resetPassword({ token, newPassword }) {
  if (!token || !newPassword) throw new HttpError(400, "token and newPassword are required");
  const resetRow = findPasswordResetToken(token);
  if (!resetRow) throw new HttpError(400, "Invalid reset token");

  const user = findUserByEmail(resetRow.email);
  if (!user) throw new HttpError(404, "User not found");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  updateUserPassword(user.id, passwordHash);
  deletePasswordResetToken(token);
  return { message: "Password reset successful" };
}

module.exports = { register, login, forgotPassword, resetPassword };
