import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBlogById } from "../services/blogService";
import BlogCardSkeleton from "../components/BlogCardSkeleton";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchBlogById(id);
        setBlog(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const paragraphs = useMemo(() => {
    if (!blog?.content) return [];
    return blog.content.split("\n").filter(Boolean);
  }, [blog]);

  if (loading) {
    return (
      <section className="space-y-4">
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </section>
    );
  }

  if (error) {
    return <section className="card p-5 text-red-700">{error}</section>;
  }

  if (!blog) return null;

  return (
    <article className="mx-auto max-w-3xl rounded-2xl border border-brand-100 bg-white/80 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{blog.category}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight text-brand-900 md:text-4xl">{blog.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5"><UserRound size={16} />{blog.authorName}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} />{formatDate(blog.createdAt)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock3 size={16} />{blog.readTime} min read</span>
      </div>

      <div className="mt-8 space-y-4 text-[1.02rem] leading-8 text-slate-700">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
};

export default BlogDetailPage;
