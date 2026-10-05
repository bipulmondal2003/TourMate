import mongoose from "mongoose";

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Escapes user input before it is used inside a MongoDB $regex / RegExp.
export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
