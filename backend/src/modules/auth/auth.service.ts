import crypto from "crypto";
import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { cookieOptions, tokenInfo } from "../../config.ts";
import { AuthFailureError } from "../../shared/errors/api-error.class.ts";
import * as authRepo from "./auth.repository.ts";
import type { LoginInput } from "./auth.validator.ts";

function signAccessToken(adminId: string, email: string): string {
  return jwt.sign({ email }, tokenInfo.jwtPrivateKey, {
    algorithm: "RS256",
    subject: adminId,
    issuer: tokenInfo.issuer,
    audience: tokenInfo.audience,
    expiresIn: tokenInfo.accessTokenValidity,
  } as jwt.SignOptions);
}

export async function login(
  input: LoginInput,
  res: Response,
): Promise<{ accessToken: string; admin: { id: string; name: string; email: string } }> {
  const admin = await authRepo.findAdminByEmail(input.email);
  if (!admin) throw new AuthFailureError();

  const valid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!valid) throw new AuthFailureError();

  const accessToken = signAccessToken(admin.id, admin.email);
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + tokenInfo.refreshTokenValidity * 1000);

  await authRepo.createRefreshToken({ token: refreshToken, adminUserId: admin.id, expiresAt });
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return { accessToken, admin: { id: admin.id, name: admin.name, email: admin.email } };
}

export async function refreshToken(rawToken: string, res: Response): Promise<string> {
  const record = await authRepo.findRefreshToken(rawToken);
  if (!record || record.expiresAt < new Date()) {
    throw new AuthFailureError("Refresh token invalid or expired");
  }

  const accessToken = signAccessToken(record.adminUser.id, record.adminUser.email);

  const newRefreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + tokenInfo.refreshTokenValidity * 1000);
  await authRepo.deleteRefreshToken(rawToken);
  await authRepo.createRefreshToken({
    token: newRefreshToken,
    adminUserId: record.adminUser.id,
    expiresAt,
  });
  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  return accessToken;
}

export async function logout(rawToken: string | undefined, res: Response): Promise<void> {
  if (rawToken) {
    await authRepo.deleteRefreshToken(rawToken).catch(() => {});
  }
  res.clearCookie("refreshToken");
}
