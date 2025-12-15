import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";

const router = express.Router();

// user login route
router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser
);

router.put(
  "/change-password",
  validateRequest(AuthValidations.changePasswordValidationSchema),
  auth(),
  AuthControllers.changePassword
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordSchema),
  AuthControllers.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordSChema),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
