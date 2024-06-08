import express from 'express';

import {
  createList,
  deleteList,
  getList,
  getLists,
  updateList
} from '../controllers/listController.mjs';

const router = express.Router();

// GET all lists for a user
router.get('/', getLists);

// POST a new list for a user
router.post('/', createList);

// GET a specific list for a user
router.get('/:id', getList);

// PATCH a specific list for a user
router.patch('/:id', updateList);

// DELETE a specific list for a user
router.delete('/:id', deleteList);

export default router;
