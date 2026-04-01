import api from "./api";

export const fetchBlogs = async (params = { page: 1, limit: 10 }) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

export const fetchBlogById = async (id) => {
  const { data } = await api.get(`/blogs/${id}`);
  return data;
};

export const createBlog = async (payload) => {
  const { data } = await api.post("/blogs", payload);
  return data;
};

export const fetchMyBlogStatus = async () => {
  const { data } = await api.get("/blogs/my/status");
  return data;
};
