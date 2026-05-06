const db = require("../repositories/mockDb");
const { createId } = require("../utils/id");
const User = require("../../../E Commerce DB/E Commerce/db/models/User");

function createUser({ name, email, passwordHash, role = "customer" }) {
  const user = {
    id: createId("usr"),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(user);
  
  User.create({
    name, email: email.toLowerCase(), passwordHash, role
  }).catch(err => console.error("Mongo Error (User):", err));

  return user;
}

function findUserByEmail(email) {
  return db.users.find((u) => u.email === email.toLowerCase()) || null;
}

function findUserById(userId) {
  return db.users.find((u) => u.id === userId) || null;
}

function countUsers() {
  return db.users.length;
}

function savePasswordResetToken(email, token) {
  const row = {
    id: createId("rst"),
    email: email.toLowerCase(),
    token,
    createdAt: new Date().toISOString(),
  };
  db.passwordResetTokens.push(row);
  return row;
}

function findPasswordResetToken(token) {
  return db.passwordResetTokens.find((row) => row.token === token) || null;
}

function deletePasswordResetToken(token) {
  const index = db.passwordResetTokens.findIndex((row) => row.token === token);
  if (index >= 0) db.passwordResetTokens.splice(index, 1);
}

function updateUserPassword(userId, passwordHash) {
  const user = findUserById(userId);
  if (!user) return null;
  user.passwordHash = passwordHash;
  user.updatedAt = new Date().toISOString();
  return user;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  countUsers,
  savePasswordResetToken,
  findPasswordResetToken,
  deletePasswordResetToken,
  updateUserPassword,
};
