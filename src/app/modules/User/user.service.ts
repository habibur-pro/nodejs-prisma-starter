import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { User, UserRole, UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import QueryBuilder from "../../../helpars/queryBuilder";
import { generateCustomId } from "../../../utils/customIdGenerator";

const createUser = async (payload: User) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { email: payload.email },
      });
      if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, " email already exists");
      }

      const phoneExist = await tx.user.findFirst({
        where: { phone: payload.phone },
      });
      if (phoneExist) {
        throw new ApiError(httpStatus.CONFLICT, "phone already exists");
      }

      if (!payload.password) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "a temporary password is required"
        );
      }
      if (existingUser) {
        throw new ApiError(400, "This  phone or email already exists");
      }

      const hashedPassword: string = await bcrypt.hash(payload.password, 12);
      const customId = await generateCustomId(prisma.user);
      const userData = {
        ...payload,
        password: hashedPassword,
        customId,
      };
      let hospital;
      if (payload.hospitalId) {
        hospital = await tx.hospital.findUnique({
          where: { id: payload.hospitalId },
        });
        if (!hospital) {
          throw new ApiError(httpStatus.BAD_REQUEST, "hospital not found");
        }
      }
      //create user
      const user = await tx.user.create({
        data: userData,
      });
      // if user role addminsitrator then add to specific hospital
      if (user.role === UserRole.ADMINISTRATOR) {
        if (hospital) {
          await tx.hospital.update({
            where: { id: payload.hospitalId! },
            data: { adminId: user.id },
          });
        }
      }

      return { message: "create successfully" };
    });
    return result;
  } catch (error: any) {
    console.log("error", error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error?.message || "something went wrong"
    );
  }
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      customId: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
      accessList: true,
      hospital: true,
      hospitalId: true,
      phone: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  console.log(user);
  return user;
};

const updateUser = async (id: string, payload: Partial<User>) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user not found");
  }
  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const blockUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user not found");
  }

  // Determine the new status
  const newStatus =
    user.status === UserStatus.BLOCKED ? UserStatus.ACTIVE : UserStatus.BLOCKED;

  const result = await prisma.user.update({
    where: { id },
    data: { status: newStatus },
  });

  return {
    data: result,
    message:
      newStatus === UserStatus.BLOCKED
        ? "User blocked successfully"
        : "User unblocked successfully",
  };
};

const deleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

const getAllUsers = async (queryParams: Record<string, any>) => {
  try {
    const queryBuilder = new QueryBuilder(prisma.user, queryParams);
    const users = await queryBuilder
      .search(["firstName", "lastName", "email", "phone"])
      .rawFilter({
        role: {
          not: "SUPER_ADMIN",
        },
        isDeleted: false,
      })
      .sort()
      .include({ hospital: true })
      .paginate()
      .execute();

    const meta = await queryBuilder.countTotal();
    return { data: users, meta };
  } catch (error) {
    console.log("error", error);
    return {
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
      data: [],
    };
  }
};

// get user profile
const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      customId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      accessList: true,
      hospital: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not found");
  }

  return user;
};
const updateMe = async (id: string, payload: User) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const updated = await prisma.user.update({ where: { id }, data: payload });
  return { message: "your profile update successfully" };
};

export const UserService = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  blockUser,
  updateMe,
  getMyProfile,
};
