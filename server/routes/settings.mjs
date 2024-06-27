// Libraries
import express from 'express';
import requireAuth from '../middleware/requireAuth.mjs';

import { sendInvitation } from '../controllers/settingsController.mjs';

const router = express.Router();

// Requires authorization for all list routes
router.use(requireAuth);

// POST an email to invite a new user
router.post('/invite', sendInvitation);

export default router;
