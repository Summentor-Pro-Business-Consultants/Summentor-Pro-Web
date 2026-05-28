"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";

interface BlogCard {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author: string;
  tags: string;
  publishedAt?: string;
  createdAt: string;
}

function TagPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        background: "var(--sp-gold-100, #fef9ec)",
        color: "var(--sp-gold-700, #92610a)",
        marginRight: 4,
      }}
    >
      {label}
    </span>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?limit=20")
      .then((r) => r.json())
      .then((j) => setBlogs((j.data?.data ?? []) as BlogCard[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <Section
        dark
        py={80}
        style={{
          background: "var(--sp-navy-1000, #050d1a)",
          borderBottom: "1px solid var(--sp-navy-800)",
        }}
      >
        <Container>
          <Eyebrow gold={false} style={{ color: "var(--sp-gold-500)" }}>
            INSIGHTS
          </Eyebrow>
          <h1
            style={{
              fontFamily: "var(--sp-font-display)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              color: "#fff",
              marginTop: 12,
              lineHeight: 1.1,
              letterSpacing: "var(--sp-track-h1)",
            }}
          >
            From the Summentor Pro desk.
          </h1>
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 16,
              color: "var(--sp-navy-300)",
              marginTop: 16,
              maxWidth: 520,
              lineHeight: 1.65,
            }}
          >
            Perspectives on business growth, MSME strategy, government relations, and the Indian
            market.
          </p>
        </Container>
      </Section>

      {/* Blog grid */}
      <Section py={72}>
        <Container>
          {loading ? (
            <div style={{ color: "var(--sp-gray-400)", textAlign: "center", padding: "60px 0" }}>
              Loading…
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ color: "var(--sp-gray-400)", textAlign: "center", padding: "60px 0" }}>
              No posts published yet. Check back soon.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 28,
              }}
            >
              {blogs.map((blog, i) => {
                const parsedTags = blog.tags
                  ? blog.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  : [];
                const date = blog.publishedAt ?? blog.createdAt;
                return (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--sp-gray-200)",
                      borderRadius: "var(--sp-radius-lg, 12px)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        style={{ width: "100%", height: 180, objectFit: "cover" }}
                      />
                    )}
                    <div
                      style={{
                        padding: "20px 22px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ marginBottom: 10 }}>
                        {parsedTags.slice(0, 3).map((t) => (
                          <TagPill key={t} label={t} />
                        ))}
                      </div>
                      <h2
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: 18,
                          fontWeight: 500,
                          color: "var(--sp-navy-900)",
                          lineHeight: 1.3,
                          margin: 0,
                          flex: 1,
                        }}
                      >
                        {blog.title}
                      </h2>
                      {blog.excerpt && (
                        <p
                          style={{
                            fontFamily: "var(--sp-font-sans)",
                            fontSize: 14,
                            color: "var(--sp-gray-600)",
                            lineHeight: 1.6,
                            marginTop: 10,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {blog.excerpt}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 18,
                          paddingTop: 14,
                          borderTop: "1px solid var(--sp-gray-100)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            fontSize: 12,
                            color: "var(--sp-gray-500)",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <User size={12} /> {blog.author}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <CalendarDays size={12} />
                            {new Date(date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <Link
                          href={`/blogs/${blog.slug}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--sp-gold-600)",
                            textDecoration: "none",
                          }}
                        >
                          Read <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
