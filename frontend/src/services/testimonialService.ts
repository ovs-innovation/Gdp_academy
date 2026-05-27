import { API_BASE_URL } from "../lib/apiConfig";

// ================= TYPES =================
export interface Testimonial {
  _id: string;
  name: string;
  position?: string;
  message: string | { en: string; [key: string]: string };
  image?: string;
  rating: number;
  courseId?: { _id: string; name: string | object };
  userId?: { _id: string; name: string; email: string };
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  name: string;
  position?: string;
  message: string | object;
  image?: string;
  rating?: number;
  courseId?: string;
  userId?: string;
}

// ================= GET FEATURED TESTIMONIALS =================
export const getFeaturedTestimonials = async (
  limit: number = 5,
): Promise<Testimonial[]> => {
  const response = await fetch(
    `${API_BASE_URL}/testimonials/featured?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  return response.json();
};

// ================= GET ALL TESTIMONIALS =================
export const getTestimonials = async (params?: {
  isActive?: boolean;
  page?: number;
  limit?: number;
  courseId?: string;
}): Promise<{
  testimonials: Testimonial[];
  total: number;
  pages: number;
  currentPage: number;
}> => {
  const queryParams = new URLSearchParams();
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.courseId) queryParams.append("courseId", params.courseId);

  const response = await fetch(
    `${API_BASE_URL}/testimonials?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  return response.json();
};

// ================= GET TESTIMONIAL BY ID =================
export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`);

  if (!response.ok) {
    throw new Error("Testimonial not found");
  }

  return response.json();
};

// ================= CREATE TESTIMONIAL (ADMIN) =================
export const createTestimonial = async (
  token: string,
  data: CreateTestimonialData,
): Promise<{ message: string; testimonial: Testimonial }> => {
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create testimonial");
  }

  return result;
};

// ================= UPDATE TESTIMONIAL (ADMIN) =================
export const updateTestimonial = async (
  token: string,
  id: string,
  data: Partial<CreateTestimonialData & { isActive?: boolean; order?: number }>,
): Promise<{ message: string; testimonial: Testimonial }> => {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update testimonial");
  }

  return result;
};

// ================= DELETE TESTIMONIAL (ADMIN) =================
export const deleteTestimonial = async (
  token: string,
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete testimonial");
  }

  return result;
};

// ================= REORDER TESTIMONIALS (ADMIN) =================
export const reorderTestimonials = async (
  token: string,
  testimonials: Array<{ id: string; order: number }>,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/testimonials/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ testimonials }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to reorder testimonials");
  }

  return result;
};
