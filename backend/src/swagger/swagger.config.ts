import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { serverUrl } from "../config.ts";

// Required: add .openapi() to Zod schemas before using registry.register()

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Security schemes: API Key (required for all except /health) + Bearer JWT (for protected auth)
registry.registerComponent("securitySchemes", "apiKey", {
  type: "apiKey",
  in: "header",
  name: "x-api-key",
  description:
    "API key for access. Required for all routes except /health. Use the Authorize button above to set it.",
});

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "JWT access token. Required for signout and token refresh. Use the Authorize button above to set it.",
});

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const doc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Summentorpro API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `${serverUrl}/api/v1`,
        description: "API Server",
      },
    ],
    tags: [
      { name: "Auth", description: "Admin login, token refresh, and logout." },
      { name: "Contact", description: "Public contact form submission." },
      { name: "Contact — Admin", description: "Admin: list, update status, and delete contact submissions." },
      { name: "Events", description: "Public event listing and visitor registration." },
      { name: "Events — Admin", description: "Admin: full CRUD on events and per-event registration management." },
      { name: "Registrations — Admin", description: "Admin: cross-event registration list and status management." },
      { name: "Blog", description: "Public blog listing and post detail." },
      { name: "Blog — Admin", description: "Admin: full CRUD on blog posts." },
      { name: "Tracking", description: "Client-side page-view ingestion (called by the frontend proxy)." },
      { name: "Analytics — Website", description: "Admin: visitor and contact form analytics." },
      { name: "Analytics — Events", description: "Admin: event and registration analytics." },
    ],
    // Default: use API key so "Authorize" is visible and x-api-key is sent with requests
    security: [{ apiKey: [] }],
  });

  return doc;
}
