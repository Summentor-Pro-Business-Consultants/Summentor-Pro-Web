import { Request, Response } from "express";

import { BadRequestError } from "../../shared/errors/api-error.class.ts";
import { SuccessResponse } from "../../shared/responses/api-response.builder.ts";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import * as authService from "./auth.service.ts";
import { loginSchema } from "./auth.validator.ts";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await authService.login(parsed.data, res);
  new SuccessResponse("Login successful", result).send(res);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw new BadRequestError("Refresh token missing");
  const accessToken = await authService.refreshToken(token, res);
  new SuccessResponse("Token refreshed", { accessToken }).send(res);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  await authService.logout(token, res);
  new SuccessResponse("Logged out", {}).send(res);
});
