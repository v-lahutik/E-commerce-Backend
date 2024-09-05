import Category from '../models/category.model.js';
import {createError} from '../utils/helper.js';

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    if (!name) {
      throw createError("Category name is required", 400);
    }
    const category = new Category({ name });
    await category.save();
    res.json(category);
  } catch (error) {
    next(error);
  }
};
export const getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

export const updateCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

export const deleteCategory = async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }