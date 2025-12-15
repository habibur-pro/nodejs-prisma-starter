import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { parseBodyData } from "../../middlewares/parseBodyData";
import fileUploaderCloud from "../../../helpars/fileUploaderCloud";

const router = express.Router();

// const uploadSingle = fileUploader.upload.single("profileImage");

// register user
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.CreateUserValidationSchema),
  UserController.createUser
);
router.get("/get-me", auth(), UserController.getMyProfile);
// get single user
router.get("/:id", auth(), UserController.getUserById);
router.patch(
  "/update-me",
  auth(),
  fileUploaderCloud.upload.single("profileImage"),
  parseBodyData,
  validateRequest(UserValidation.updateMeSchema),
  UserController.updateMyProfile
);
// update user
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.userUpdateSchema),
  UserController.updateUser
);

// block user
router.post("/:id", auth(UserRole.SUPER_ADMIN), UserController.blockUser);

router.patch("/:id", auth(), UserController.updateUser);
// delete user
router.delete("/:id", auth(UserRole.SUPER_ADMIN), UserController.deleteUser);

// get all user
router.get("/", auth(UserRole.SUPER_ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
