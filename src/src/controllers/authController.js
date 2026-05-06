const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function forgotPassword(req, res, next) {
  try {
    const data = authService.forgotPassword(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const data = await authService.resetPassword(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, forgotPassword, resetPassword };
