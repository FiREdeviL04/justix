import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const BlogCard = ({ blog }) => {
  const preview = blog.content.length > 160 ? `${blog.content.slice(0, 160)}...` : blog.content;

  return (
    <article className="card h-full p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{blog.category}</p>
      <h3 className="mt-2 line-clamp-3 text-xl font-semibold text-brand-900">{blog.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-700">{preview}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5"><UserRound size={16} />{blog.authorName}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} />{formatDate(blog.createdAt)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock3 size={16} />{blog.readTime} min read</span>
      </div>

      <Link to={`/blog/${blog._id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900">
        Read article
      </Link>
    </article>
  );
};

export default BlogCard;
