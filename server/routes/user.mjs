import express from 'express';

import {
  deleteUser,
  getUser,
  logInUser,
  signUpUser,
  updateCompleted
} from '../controllers/userController.mjs';

const router = express.Router();

router.get('/:id', getUser);

// POST a login request
router.post('/login', logInUser);

// POST a new user
router.post('/signup', signUpUser);

// DELETE a user
router.delete('/:id', deleteUser);

// PATCH a user's completed tasks list
router.patch('/:id', updateCompleted);

export default router;
