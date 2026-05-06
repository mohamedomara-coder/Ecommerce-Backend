const adminService = require("../services/adminService");

function getStats(_req, res, next) {
  try {
    const stats = adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };
