import express from 'express';

import {
  deleteUser,
  getUser,
  logInUser,
  signUpUser
} from '../controllers/userController.mjs';

const router = express.Router();

router.get('/:id', getUser);

router.post('/login', logInUser);

router.post('/signup', signUpUser);

router.delete('/:id', deleteUser);

export default router;
