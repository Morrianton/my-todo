import jwt from "jsonwebtoken";

import User from "../models/userModel.mjs";

/**
 * Creates a JSON Web Token.
 * @param {string} _id MongoDB document ID.
 */
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

/**
 * Logs a user in.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const logInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.logIn(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Creates a new user in the database.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const signUpUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.signUp(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Gets a single user from the database by its ID. 
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const getUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found.'});
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Gets all the users from the database.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    if (!users) return res.status(404).json({ error: 'No users were found.'});

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Deletes a single user from the database.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const deleteUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deleteUser) return res.status(404).json({ error: 'User not found.'});

    res.status(200).json({ deletedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Updates a single user's completed tasks list.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const updateCompleted = async (req, res) => {
  const userId = req.user._id;

  try {
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { ...req.body });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
