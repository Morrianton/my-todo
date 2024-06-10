import User from "../models/userModel.mjs";
import jwt from "jsonwebtoken";

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
export const loginUser = async (req, res) => {
  res.json({ message: 'Login user.' });
};

/**
 * Creates a new user in the database.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
