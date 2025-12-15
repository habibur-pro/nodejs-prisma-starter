import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = express.Router();

// user login route
router.post(
  "/login",
  validateRequest(authValidation.loginValidationSchema),
  AuthController.loginUser
);

router.put(
  "/change-password",
  validateRequest(authValidation.changePasswordValidationSchema),
  auth(),
  AuthController.changePassword
);

router.post(
  "/forgot-password",
  validateRequest(authValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSChema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
