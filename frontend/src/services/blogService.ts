import { API_BASE_URL } from "../lib/apiConfig";

// ================= TYPES =================
export interface Blog {
  _id: string;
  title: string | { en: string; [key: string]: string };
  slug: string;
  excerpt?: string | { en: string; [key: string]: string };
  content: string | { en: string; [key: string]: string };
  featuredImage?: { url: string; alt: string };
  author: { _id: string; name: string; email: string };
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string | object;
  excerpt?: string | object;
  content: string | object;
  featuredImage?: { url: string; alt: string };
  category?: string;
  tags?: string[];
  status?: string;
}

// ================= GET ALL BLOGS =================
export const getBlogs = async (params?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  blogs: Blog[];
  total: number;
  pages: number;
  currentPage: number;
}> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const response = await fetch(
    `${API_BASE_URL}/blogs?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return response.json();
};

// ================= GET BLOG BY SLUG =================
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`);

  if (!response.ok) {
    throw new Error("Blog not found");
  }

  return response.json();
};

// ================= GET BLOG BY ID =================
export const getBlogById = async (id: string): Promise<Blog> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`);

  if (!response.ok) {
    throw new Error("Blog not found");
  }

  return response.json();
};

// ================= GET RELATED BLOGS =================
export const getRelatedBlogs = async (
  id: string,
  limit: number = 3,
): Promise<Blog[]> => {
  const response = await fetch(
    `${API_BASE_URL}/blogs/${id}/related?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch related blogs");
  }

  return response.json();
};

// ================= CREATE BLOG (ADMIN) =================
export const createBlog = async (
  token: string,
  data: CreateBlogData,
): Promise<{ message: string; blog: Blog }> => {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create blog");
  }

  return result;
};

// ================= UPDATE BLOG (ADMIN) =================
export const updateBlog = async (
  token: string,
  id: string,
  data: Partial<CreateBlogData>,
): Promise<{ message: string; blog: Blog }> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update blog");
  }

  return result;
};

// ================= DELETE BLOG (ADMIN) =================
export const deleteBlog = async (
  token: string,
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete blog");
  }

  return result;
};
