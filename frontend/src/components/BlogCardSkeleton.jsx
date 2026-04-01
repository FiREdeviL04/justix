const BlogCardSkeleton = () => {
  return (
    <article className="card p-5">
      <div className="h-3 w-24 animate-pulse rounded bg-brand-100" />
      <div className="mt-3 h-6 w-11/12 animate-pulse rounded bg-brand-100" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-brand-100" />
      <div className="mt-2 h-4 w-10/12 animate-pulse rounded bg-brand-100" />
      <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-brand-100" />
    </article>
  );
};

export default BlogCardSkeleton;
