import mongoose from "mongoose";
import argon2 from "argon2";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
 }, { timestamps: true });

 // static signup method
 userSchema.statics.signup = async function (email, password) {
  const exists = await this.findOne({ email });

  if (exists) throw Error('Email already in use.');

  try {
    const hash = await argon2.hash(password);
    return await this.create({ email, password: hash });
  } catch (error) {
    console.error(error.message);
  }
 };

 export default mongoose.model('User', userSchema);
