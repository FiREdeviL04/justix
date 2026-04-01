import { useState } from "react";
import BlogCard from "../components/BlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import useBlogs from "../hooks/useBlogs";

const BlogPage = () => {
  const [page, setPage] = useState(1);
  const { blogs, pagination, loading, error } = useBlogs({ page, limit: 9 });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Legal Insights</h1>
          <p className="mt-1 text-slate-600">Practical legal articles from verified lawyers on Justix.</p>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <BlogCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {!loading && error && <div className="card p-5 text-red-700">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">Page {pagination.page} of {pagination.totalPages}</span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BlogPage;
