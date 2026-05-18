/**
 * blog.docs.ts — OpenAPI path registrations for the Blog module.
 *
 * Public:
 *   GET /blogs           — list published posts (paginated, filterable by tag)
 *   GET /blogs/:slug     — single published post by URL slug
 *
 * Admin (Bearer JWT required):
 *   GET    /admin/blogs       — list all posts (any status, searchable)
 *   GET    /admin/blogs/:id   — single post by UUID (for edit view)
 *   POST   /admin/blogs       — create post
 *   PATCH  /admin/blogs/:id   — partial update
 *   DELETE /admin/blogs/:id   — delete post
 */

import { z } from "zod";

import { registry } from "./swagger.config.ts";

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

const BlogObject = z
  .object({
    id: z.string().uuid().openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
    title: z
      .string()
      .openapi({ example: "Five Habits of High-Impact Leaders" }),
    slug: z
      .string()
      .openapi({ example: "five-habits-of-high-impact-leaders" }),
    excerpt: z
      .string()
      .nullable()
      .openapi({ example: "Explore the daily rituals that separate effective executives from the rest." }),
    content: z.string().openapi({ example: "<p>Leadership is not a title…</p>" }),
    coverImage: z
      .string()
      .url()
      .nullable()
      .openapi({ example: "https://cdn.summentorpro.com/blog/habits-cover.jpg" }),
    author: z.string().nullable().openapi({ example: "Summentor Pro Team" }),
    tags: z.string().nullable().openapi({ example: "leadership,productivity" }),
    status: z.enum(["draft", "published"]).openapi({ example: "published" }),
    createdAt: z.string().datetime().openapi({ example: "2025-04-20T07:00:00.000Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-05-01T09:30:00.000Z" }),
  })
  .openapi("Blog");

const PaginationMeta = z.object({
  total: z.number().openapi({ example: 12 }),
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 10 }),
  totalPages: z.number().openapi({ example: 2 }),
});

const ErrorBody = z
  .object({ message: z.string(), success: z.literal(false) })
  .openapi("BlogError");

const idParam = z.object({
  id: z.string().uuid().openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
});

// ---------------------------------------------------------------------------
// GET /blogs  (public)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/blogs",
  tags: ["Blog"],
  summary: "List published posts",
  description:
    "Returns all published blog posts ordered by newest first. " +
    "Filter by comma-separated tag names using the `tag` query param.",
  security: [{ apiKey: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
      limit: z.coerce.number().int().min(1).max(50).optional().openapi({ example: 10 }),
      tag: z
        .string()
        .optional()
        .openapi({ example: "leadership", description: "Filter posts that include this tag" }),
    }),
  },
  responses: {
    200: {
      description: "Paginated published posts",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Blogs retrieved" }),
              success: z.literal(true),
              data: z.object({ data: z.array(BlogObject), ...PaginationMeta.shape }),
            })
            .openapi("PublicBlogsResponse"),
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// GET /blogs/:slug  (public)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/blogs/{slug}",
  tags: ["Blog"],
  summary: "Get post by slug",
  description: "Returns the full content of a single published post. Used by the blog detail page.",
  security: [{ apiKey: [] }],
  request: {
    params: z.object({
      slug: z.string().openapi({ example: "five-habits-of-high-impact-leaders" }),
    }),
  },
  responses: {
    200: {
      description: "Blog post detail",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Blog retrieved" }),
              success: z.literal(true),
              data: BlogObject,
            })
            .openapi("SingleBlogResponse"),
        },
      },
    },
    404: {
      description: "Post not found or not published",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "Not Found", success: false },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/blogs  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/blogs",
  tags: ["Blog — Admin"],
  summary: "List all posts (admin)",
  description:
    "Returns all blog posts regardless of status, paginated. " +
    "Supports filtering by `status` and full-text `search` across title and content.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
      limit: z.coerce.number().int().min(1).max(50).optional().openapi({ example: 10 }),
      status: z.enum(["draft", "published"]).optional().openapi({ example: "draft" }),
      search: z.string().optional().openapi({ example: "leadership" }),
    }),
  },
  responses: {
    200: {
      description: "Paginated blog list",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Blogs retrieved" }),
              success: z.literal(true),
              data: z.object({ data: z.array(BlogObject), ...PaginationMeta.shape }),
            })
            .openapi("AdminBlogsResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/blogs/:id  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/blogs/{id}",
  tags: ["Blog — Admin"],
  summary: "Get post by ID (admin)",
  description: "Returns a single post by its UUID regardless of status. Used to populate the editor view.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    200: {
      description: "Blog post",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Blog retrieved" }),
              success: z.literal(true),
              data: BlogObject,
            })
            .openapi("AdminSingleBlogResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// POST /admin/blogs  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/admin/blogs",
  tags: ["Blog — Admin"],
  summary: "Create post",
  description:
    "Creates a new blog post. If `slug` is omitted it is auto-generated from `title`. " +
    "Posts are created as `draft` by default.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              title: z
                .string()
                .min(1)
                .max(200)
                .openapi({ example: "Five Habits of High-Impact Leaders" }),
              slug: z
                .string()
                .max(220)
                .optional()
                .openapi({ example: "five-habits-of-high-impact-leaders", description: "Auto-generated from title if omitted. Lowercase, hyphens only." }),
              excerpt: z
                .string()
                .max(500)
                .optional()
                .openapi({ example: "Explore the daily rituals that separate effective executives." }),
              content: z
                .string()
                .min(1)
                .openapi({ example: "<p>Leadership is not a title…</p>" }),
              coverImage: z
                .string()
                .url()
                .optional()
                .openapi({ example: "https://cdn.summentorpro.com/blog/habits-cover.jpg" }),
              author: z.string().max(100).optional().openapi({ example: "Summentor Pro Team" }),
              tags: z
                .string()
                .optional()
                .openapi({ example: "leadership,productivity", description: "Comma-separated tag names" }),
              status: z.enum(["draft", "published"]).optional().openapi({ example: "draft" }),
            })
            .openapi("CreateBlogBody"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post created",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Blog created" }),
              success: z.literal(true),
              data: BlogObject,
            })
            .openapi("CreateBlogResponse"),
        },
      },
    },
    400: { description: "Validation error or slug conflict", content: { "application/json": { schema: ErrorBody } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// PATCH /admin/blogs/:id  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "patch",
  path: "/admin/blogs/{id}",
  tags: ["Blog — Admin"],
  summary: "Update post (partial)",
  description: "Applies a partial update. Only provided fields are changed. Publish a draft by sending `{ \"status\": \"published\" }`.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              title: z.string().min(1).max(200).optional(),
              slug: z.string().max(220).optional(),
              excerpt: z.string().max(500).optional(),
              content: z.string().min(1).optional(),
              coverImage: z.string().url().optional(),
              author: z.string().max(100).optional(),
              tags: z.string().optional(),
              status: z.enum(["draft", "published"]).optional().openapi({ example: "published" }),
            })
            .openapi("UpdateBlogBody"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post updated",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Blog updated" }),
              success: z.literal(true),
              data: BlogObject,
            })
            .openapi("UpdateBlogResponse"),
        },
      },
    },
    400: { description: "Validation error", content: { "application/json": { schema: ErrorBody } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// DELETE /admin/blogs/:id  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "delete",
  path: "/admin/blogs/{id}",
  tags: ["Blog — Admin"],
  summary: "Delete post",
  description: "Permanently removes a blog post. Irreversible.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    204: { description: "Deleted — no content" },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorBody } } },
  },
});
