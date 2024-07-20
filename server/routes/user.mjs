import express from 'express';
import requireAuth from '../middleware/requireAuth.mjs';

import {
  deleteUser,
  getUser,
  logInUser,
  signUpUser,
} from '../controllers/userController.mjs';

const router = express.Router();

router.get('/', requireAuth, getUser);

// POST a login request
router.post('/login', logInUser);

// POST a new user
router.post('/signup', signUpUser);

// DELETE a user
router.delete('/', requireAuth, deleteUser);

export default router;
