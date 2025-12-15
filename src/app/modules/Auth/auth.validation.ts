import { z } from "zod";

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});
const resetPasswordSChema = z.object({
  body: z.object({
    token: z.string(),
    userId: z.string(),
    password: z.string(),
  }),
});

export const authValidation = {
  changePasswordValidationSchema,
  loginValidationSchema,
  resetPasswordSChema,
  forgotPasswordSchema,
};
