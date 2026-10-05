import mongoose from "mongoose";

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
