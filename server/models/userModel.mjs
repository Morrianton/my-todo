import mongoose from "mongoose";
import argon2 from "argon2";
import validator from "validator";

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

 // static login method
 userSchema.statics.logIn = async function (email, password) {
  if (!email || !password) throw Error('All fields must be filled.')
    
  const user = await this.findOne({ email });

  if (!user) throw Error('Incorrect email.');

  const isMatch = await argon2.verify(user.password, password);

  if (!isMatch) throw Error('Incorrect password.');

  return user;
 }

 // static signup method
 userSchema.statics.signUp = async function (email, password) {
  if (!email || !password) throw Error('All fields must be filled.');

  if (!validator.isEmail(email)) throw Error('Email is invalid.');

  if (!validator.isStrongPassword(password)) throw Error('Password is not strong enough.');

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
