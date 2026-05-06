const jwt = require("jsonwebtoken");
const env = require("../config/env");
const HttpError = require("../utils/httpError");
const { findUserById } = require("../models/userModel");

function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, "Missing token"));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = findUserById(payload.sub);
    if (!user) return next(new HttpError(401, "User not found"));
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
}

function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, "Unauthorized"));
    if (req.user.role !== role) return next(new HttpError(403, "Forbidden"));
    next();
  };
}

module.exports = { requireAuth, requireRole };
