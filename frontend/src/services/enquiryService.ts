import { API_BASE_URL } from "../lib/apiConfig";

// ================= TYPES =================
export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  programId?: string;
  workshopId?: string;
  source: "program" | "workshop" | "contact_form" | "general";
  status: "new" | "in_progress" | "closed";
  userId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  whatsappConsent?: boolean;
  programId?: string;
  workshopId?: string;
  source?: string;
}

// ================= CREATE ENQUIRY =================
export const submitEnquiry = async (
  data: CreateEnquiryData,
): Promise<{ message: string; enquiry: Enquiry }> => {
  const response = await fetch(`${API_BASE_URL}/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit enquiry");
  }

  return result;
};

// ================= GET ENQUIRIES (ADMIN) =================
export const getEnquiries = async (
  token: string,
  params?: {
    status?: string;
    source?: string;
    page?: number;
    limit?: number;
    search?: string;
  },
): Promise<{
  enquiries: Enquiry[];
  total: number;
  pages: number;
  currentPage: number;
}> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.source) queryParams.append("source", params.source);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const response = await fetch(
    `${API_BASE_URL}/enquiries?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch enquiries");
  }

  return response.json();
};

// ================= GET SINGLE ENQUIRY =================
export const getEnquiry = async (
  token: string,
  id: string,
): Promise<Enquiry> => {
  const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enquiry");
  }

  return response.json();
};

// ================= UPDATE ENQUIRY STATUS =================
export const updateEnquiryStatus = async (
  token: string,
  id: string,
  data: {
    status?: string;
    notes?: string;
    assignedTo?: string;
  },
): Promise<{ message: string; enquiry: Enquiry }> => {
  const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update enquiry");
  }

  return result;
};

// ================= DELETE ENQUIRY =================
export const deleteEnquiry = async (
  token: string,
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete enquiry");
  }

  return result;
};

// ================= GET ENQUIRY STATS =================
export const getEnquiryStats = async (
  token: string,
): Promise<{
  total: number;
  newEnquiries: number;
  inProgress: number;
  closed: number;
  bySource: any[];
}> => {
  const response = await fetch(`${API_BASE_URL}/enquiries/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enquiry statistics");
  }

  return response.json();
};
