import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { calculateBMI } from "../utils/healthCalculations";
import type {
  CreateHealthProfileInput,
  UpdateHealthProfileInput,
} from "../validators/healthProfile.validator";

const healthProfileModel = prisma as typeof prisma & {
  healthProfile: any;
};

// CREATE Health Profile
export const createHealthProfileService = async (
  userId: string,
  data: CreateHealthProfileInput,
) => {
  // 1. Check if profile already exists
  const existing = await healthProfileModel.healthProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new AppError(
      "Health profile already exists. Use update instead.",
      400,
    );
  }

  // 2. Calculate BMI
  const bmi = calculateBMI(data.weight, data.height);

  // 3. Create profile
  const profile = await healthProfileModel.healthProfile.create({
    data: {
      userId,
      ...data,
      bmi,
    },
  });

  return profile;
};

// GET Health Profile
export const getHealthProfileService = async (userId: string) => {
  const profile = await healthProfileModel.healthProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      "Health profile not found. Please create one first.",
      404,
    );
  }

  return profile;
};

// UPDATE Health Profile
export const updateHealthProfileService = async (
  userId: string,
  data: UpdateHealthProfileInput,
) => {
  // 1. Check if profile exists
  const existing = await healthProfileModel.healthProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new AppError(
      "Health profile not found. Please create one first.",
      404,
    );
  }

  // 2. Recalculate BMI if weight or height changed
  let updateData: any = { ...data };

  if (data.weight || data.height) {
    const newWeight = data.weight || existing.weight;
    const newHeight = data.height || existing.height;
    updateData.bmi = calculateBMI(newWeight, newHeight);
  }

  // 3. Update profile
  const profile = await healthProfileModel.healthProfile.update({
    where: { userId },
    data: updateData,
  });

  return profile;
};

// DELETE Health Profile
export const deleteHealthProfileService = async (userId: string) => {
  const existing = await healthProfileModel.healthProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new AppError("Health profile not found", 404);
  }

  await healthProfileModel.healthProfile.delete({
    where: { userId },
  });

  return { message: "Health profile deleted successfully" };
};
