"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, User, Tag } from "lucide-react";
import DOMPurify from "dompurify";
import Container from "@/components/ui/Container";

interface Blog {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((j) => {
        if (j) setBlog(j.data as Blog);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--sp-gray-400)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <h1 style={{ fontFamily: "var(--sp-font-sans)", fontSize: 32, color: "#000" }}>
          Post not found
        </h1>
        <Link
          href="/blogs"
          style={{ color: "var(--sp-gold-600)", fontFamily: "var(--sp-font-sans)" }}
        >
          ← Back to Insights
        </Link>
      </div>
    );
  }

  const date = blog.publishedAt ?? blog.createdAt;
  const parsedTags = blog.tags
    ? blog.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <article>
      {/* Hero */}
      <div
        style={{
          background: "var(--sp-navy-1000, #050d1a)",
          padding: "clamp(48px, 7vw, 72px) 0 clamp(40px, 6vw, 56px)",
          borderBottom: "1px solid var(--sp-navy-800)",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blogs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--sp-navy-400)",
                fontFamily: "var(--sp-font-sans)",
                fontSize: 13,
                textDecoration: "none",
                marginBottom: 24,
              }}
            >
              <ArrowLeft size={14} /> Back to Insights
            </Link>

            {parsedTags.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {parsedTags.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "2px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      background: "rgba(var(--sp-gold-rgb,195,149,60),0.15)",
                      color: "var(--sp-gold-400)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <h1
              style={{
                fontFamily: "var(--sp-font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.1,
                letterSpacing: "var(--sp-track-h1)",
                maxWidth: 760,
                margin: 0,
              }}
            >
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 17,
                  color: "var(--sp-navy-300)",
                  marginTop: 16,
                  maxWidth: 680,
                  lineHeight: 1.35,
                }}
              >
                {blog.excerpt}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 24,
                fontSize: 13,
                color: "var(--sp-navy-400)",
                fontFamily: "var(--sp-font-sans)",
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User size={13} /> {blog.author}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarDays size={13} />
                {new Date(date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Cover image */}
      {blog.coverImage && (
        <div style={{ background: "var(--sp-navy-950, #060f1d)" }}>
          <Container>
            {}
            <img
              src={blog.coverImage}
              alt={blog.title}
              style={{
                width: "100%",
                maxHeight: 440,
                objectFit: "cover",
                borderRadius: "0 0 12px 12px",
              }}
            />
          </Container>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "clamp(40px, 6vw, 60px) 0 clamp(56px, 8vw, 80px)" }}>
        <Container>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="blog-content"
              // Sanitised before injection — blog HTML is admin-authored, but
              // sanitising at render is defence-in-depth against stored XSS.
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
            />

            {parsedTags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 48,
                  paddingTop: 24,
                  borderTop: "1px solid var(--sp-gray-100)",
                  flexWrap: "wrap",
                }}
              >
                <Tag size={14} style={{ color: "var(--sp-gray-400)" }} />
                {parsedTags.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "3px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: "var(--sp-gray-100)",
                      color: "var(--sp-gray-600)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: 40 }}>
              <Link
                href="/blogs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--sp-gold-600)",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft size={14} /> Back to all posts
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <style>{`
        .blog-content { font-family: var(--sp-font-sans); font-size: 16px; line-height: 1.65; color: var(--sp-navy-800, #1a2740); }
        .blog-content h2 { font-family: var(--sp-font-sans); font-size: 1.6em; font-weight: 500; margin: 1.6em 0 0.5em; color: #000; }
        .blog-content h3 { font-family: var(--sp-font-sans); font-size: 1.25em; font-weight: 500; margin: 1.4em 0 0.4em; color: #000; }
        .blog-content p { margin: 0 0 1.1em; }
        .blog-content ul { list-style: disc; padding-left: 1.5em; margin: 0.8em 0 1.1em; }
        .blog-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.8em 0 1.1em; }
        .blog-content li { margin-bottom: 0.3em; }
        .blog-content blockquote { border-left: 3px solid var(--sp-gold-400); padding: 0.5em 1.2em; margin: 1.2em 0; color: var(--sp-gray-600); font-style: italic; }
        .blog-content code { background: var(--sp-gray-100); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .blog-content a { color: var(--sp-gold-600); text-decoration: underline; }
        .blog-content hr { border: none; border-top: 1px solid var(--sp-gray-200); margin: 2em 0; }
        .blog-content strong { font-weight: 700; }
        .blog-content em { font-style: italic; }
      `}</style>
    </article>
  );
}
