import prisma from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { verifyUserExists } from "../auth/auth.service.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.validation.js";

export const verifyCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }
};

export const getCategories = async (userId: string) => {
  await verifyUserExists(userId);

  return prisma.category.findMany({
    where: {
      OR: [{ userId: null }, { userId: userId }],
    },
  });
};

export const getCategoryById = async (categoryId: string, userId: string) => {
  await verifyUserExists(userId);
  await verifyCategoryExists(categoryId);

  return prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ userId: null }, { userId: userId }],
    },
  });
};

export const createCategory = async (
  userId: string,
  data: CreateCategoryInput,
) => {
  await verifyUserExists(userId);

  const { name, type, icon, color } = data;
  return prisma.category.create({
    data: {
      name,
      type,
      icon: icon ?? null,
      color: color ?? null,
      userId,
    },
  });
};

export const updateCategory = async (
  categoryId: string,
  userId: string,
  data: UpdateCategoryInput,
) => {
  await verifyUserExists(userId);
  await verifyCategoryExists(categoryId);

  let updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.color !== undefined) updateData.color = data.color;

  return prisma.category.update({
    where: {
      id: categoryId,
      userId: userId,
    },
    data: updateData,
  });
};

export const deleteCategory = async (categoryId: string, userId: string) => {
  await verifyUserExists(userId);
  await verifyCategoryExists(categoryId);

  return prisma.category.delete({
    where: {
      id: categoryId,
      userId: userId,
    },
  });
}