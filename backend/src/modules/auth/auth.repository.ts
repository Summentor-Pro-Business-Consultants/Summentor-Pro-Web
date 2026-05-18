import { prisma } from "../../infrastructure/db/prisma.client.ts";

export async function findAdminByEmail(email: string) {
  return prisma.adminUser.findUnique({ where: { email } });
}

export async function createRefreshToken(data: {
  token: string;
  adminUserId: string;
  expiresAt: Date;
}) {
  return prisma.refreshToken.create({ data });
}

export async function findRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { adminUser: true },
  });
}

export async function deleteRefreshToken(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}
