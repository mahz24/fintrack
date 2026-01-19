import type { NextFunction, Request, Response } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "./categories.service.js";

export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const categories = await getCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId!.toString(), userId);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export const createCategoryController = async (req: Request, res: Response, next: NextFunction ) => {
  try {
    const userId = req.userId!;
    const categoryData = req.body;
    const newCategory = await createCategory(userId, categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const categoryId = req.params.id;
    const categoryData = req.body;
    const updatedCategory = await updateCategory(categoryId!.toString(), userId, categoryData);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
}

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const categoryId = req.params.id;
    await deleteCategory(categoryId!.toString(), userId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};