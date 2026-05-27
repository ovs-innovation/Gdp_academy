import { API_BASE_URL } from "../lib/apiConfig";

// ================= TYPES =================
export interface GalleryItem {
  _id?: string;
  url: string;
  type: "image" | "video";
  alt?: string;
  caption?: string | { en: string; [key: string]: string };
  order: number;
}

export interface Gallery {
  _id: string;
  title: string | { en: string; [key: string]: string };
  description?: string | { en: string; [key: string]: string };
  items: GalleryItem[];
  category: string;
  isActive: boolean;
  uploadedBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryData {
  title: string | object;
  description?: string | object;
  items: GalleryItem[];
  category?: string;
}

// ================= GET ALL GALLERIES =================
export const getGalleries = async (params?: {
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<{
  galleries: Gallery[];
  total: number;
  pages: number;
  currentPage: number;
}> => {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append("category", params.category);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/gallery?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch galleries");
  }

  return response.json();
};

// ================= GET GALLERY BY ID =================
export const getGalleryById = async (id: string): Promise<Gallery> => {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`);

  if (!response.ok) {
    throw new Error("Gallery not found");
  }

  return response.json();
};

// ================= GET GALLERY BY CATEGORY =================
export const getGalleryByCategory = async (
  category: string,
): Promise<Gallery[]> => {
  const response = await fetch(`${API_BASE_URL}/gallery/category/${category}`);

  if (!response.ok) {
    throw new Error("Failed to fetch gallery");
  }

  return response.json();
};

// ================= CREATE GALLERY (ADMIN) =================
export const createGallery = async (
  token: string,
  data: CreateGalleryData,
): Promise<{ message: string; gallery: Gallery }> => {
  const response = await fetch(`${API_BASE_URL}/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create gallery");
  }

  return result;
};

// ================= UPDATE GALLERY (ADMIN) =================
export const updateGallery = async (
  token: string,
  id: string,
  data: Partial<CreateGalleryData & { isActive?: boolean }>,
): Promise<{ message: string; gallery: Gallery }> => {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update gallery");
  }

  return result;
};

// ================= ADD GALLERY ITEM (ADMIN) =================
export const addGalleryItem = async (
  token: string,
  id: string,
  item: GalleryItem,
): Promise<{ message: string; gallery: Gallery }> => {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add item");
  }

  return result;
};

// ================= REMOVE GALLERY ITEM (ADMIN) =================
export const removeGalleryItem = async (
  token: string,
  id: string,
  itemId: string,
): Promise<{ message: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/gallery/${id}/items/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to remove item");
  }

  return result;
};

// ================= DELETE GALLERY (ADMIN) =================
export const deleteGallery = async (
  token: string,
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete gallery");
  }

  return result;
};
