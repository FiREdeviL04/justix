import { useCallback, useMemo } from "react";
import { fetchBlogs } from "../services/blogService";
import useAsyncData from "./useAsyncData";

const useBlogs = ({ page = 1, limit = 10 } = {}) => {
  const loadBlogs = useCallback(() => fetchBlogs({ page, limit }), [page, limit]);
  const { data, loading, error, refetch } = useAsyncData(loadBlogs, [loadBlogs]);

  const blogs = useMemo(() => data?.items || data || [], [data]);
  const pagination = useMemo(
    () => ({
      page: data?.page || page,
      limit: data?.limit || limit,
      total: data?.total || blogs.length,
      totalPages: data?.totalPages || 1,
    }),
    [blogs.length, data, limit, page]
  );

  return {
    blogs,
    pagination,
    loading,
    error,
    refetch,
  };
};

export default useBlogs;
