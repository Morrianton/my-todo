import express from 'express';

import {
  deleteUser,
  getUser,
  loginUser,
  signupUser
} from '../controllers/userController.mjs';

const router = express.Router();

router.get('/:id', getUser);

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.delete('/:id', deleteUser);

export default router;
