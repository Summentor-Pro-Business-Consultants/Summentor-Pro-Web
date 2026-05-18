import { CookieOptions } from "express";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`!!!! MISSING REQUIRED ENVIRONMENT VARIABLE: ${key} !!!!`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string) {
  return process.env[key] ?? fallback;
}

export const originUrl = requireEnv("ORIGIN_URL");
export const isProduction = optionalEnv("NODE_ENV", "production") === "production";
export const timeZone = optionalEnv("TZ", "in");
export const port = requireEnv("PORT");
export const serverUrl = `http://localhost:${port}`;
export const dbConfig = {
  host: requireEnv("DB_HOST"),
  port: requireEnv("DB_PORT"),
  name: requireEnv("DB_NAME"),
  user: requireEnv("DB_USER"),
  password: requireEnv("DB_PASSWORD"),
};
export const dbUrl = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

// Set DATABASE_URL for Prisma datasource
process.env.DATABASE_URL = dbUrl;

export const logDirectory = optionalEnv("LOG_DIRECTORY", "logs");
export const apiKey = requireEnv("API_KEY");

export const tokenInfo = {
  accessTokenValidity: parseInt(requireEnv("ACCESS_TOKEN_VALIDITY_SEC")),
  refreshTokenValidity: parseInt(requireEnv("REFRESH_TOKEN_VALIDITY_SEC")),
  issuer: requireEnv("TOKEN_ISSUER"),
  audience: requireEnv("TOKEN_AUDIENCE"),
  jwtPrivateKey: Buffer.from(requireEnv("JWT_PRIVATE_KEY_BASE64"), "base64").toString("utf-8"),
  jwtPublicKey: Buffer.from(requireEnv("JWT_PUBLIC_KEY_BASE64"), "base64").toString("utf-8"),
};

const cookieMagAgeSeconds = Number(optionalEnv("COOKIE_MAX_AGE_SEC", "3600"));
const cookieDomain = requireEnv("COOKIE_DOMAIN");

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict",
  maxAge: cookieMagAgeSeconds * 1000,
  domain: isProduction ? cookieDomain : undefined,
  path: "/",
};

export const sesCredentials = {
  awsRegion: requireEnv("AWS_REGION"),
  awsAccessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
};

export const systemEmail = requireEnv("SYSTEM_EMAIL");
