import mongoose from 'mongoose';
import List from '../models/listModel.mjs';

/**
 * Gets all the lists for a user from the database.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const getLists = async (req, res) => {
  try {
    const lists = await List.find({}).sort({ createdAt: -1 });

    if (!lists) {
      return res.status(404).json({ error: 'No lists found for this user.'});
    }

    res.status(200).json(lists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Gets a single list for a user from the database by its ID. 
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const getList = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'List ID is invalid.' });
  }

  try {
    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ error: 'List not found.'});
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Creates a single new list for a user in the database.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const createList = async (req, res) => {
  const { name, items, owner_id } = req.body;

  try {
    const list = await List.create({ name, items, owner_id });
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

/**
 * Deletes a single list for a user from the database.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
export const deleteList = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'List ID is invalid.'});
  }

  try {
    const deletedList = await List.findOneAndDelete({ _id: id });

    if (!deletedList) {
      return res.status(404).json({ error: 'List not found.'});
    }

    res.status(200).json({ deletedList });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Updates a single list for a user in the database.
 * @param {Request}  req Request object.
 * @param {Response} res Response object.
 */
export const updateList = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'List ID is invalid.'});
  }

  try {
    const updatedList = await List.findOneAndUpdate({ _id: id }, { ...req.body });

    if (!updatedList) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.status(200).json({ updatedList });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
