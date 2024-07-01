// Libraries
import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs';

/**
 * Requires authorization for a request by JSON Web Token.
 * 
 * @param {Request}  req  Request object.
 * @param {Response} res  Response object.
 * @param {Function} next Callback function to run after this middleware.
 */
export default async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  
  // removes "Bearer " from the authorization property
  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id }).select('_id');
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: 'Not Authorized'});
  }
};
