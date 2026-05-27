import { API_BASE_URL } from "../lib/apiConfig";

export interface Program {
  _id: string;
  name: string | { en: string; [key: string]: string };
  description?: string | { en: string; [key: string]: string };
  danceStyle?: string;
  DanceStyle?: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced" | "all_levels";
  duration?: number;
  durationUnit?: "weeks" | "months" | "hours";
  image?: string;
  thumbnail?: string;
  previewVideo?: string;
  galleryImages?: string[];
  price?: number;
  discountPrice?: number;
  currency?: string;
  curriculum?: Array<{
    title: string | object;
    description?: string | object;
    order: number;
  }>;
  benefits?: Array<string | object>;
  faqs?: Array<{
    question: string | object;
    answer: string | object;
  }>;
  recordedClasses?: Array<{
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
  }>;
  // Workshop specific fields
  workshopDate?: string;
  workshopTime?: string;
  workshopEndTime?: string;
  zoomLink?: string;
  workshopBanner?: string;
  status: string;
  type?: "program" | "workshop";
  slug?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  };
  enrollmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramsResponse {
  Programs: Program[];
  programs: Program[];
  courses: Program[];
  count: number;
}

export const fetchPrograms = async (params?: {
  status?: string;
  search?: string;
  DanceStyle?: string;
  limit?: number;
}): Promise<ProgramsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.status) {
    queryParams.append("status", params.status);
  }
  if (params?.search) {
    queryParams.append("search", params.search);
  }
  if (params?.DanceStyle) {
    queryParams.append("category", params.DanceStyle);
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  queryParams.append("type", "program");

  const response = await fetch(
    `${API_BASE_URL}/public/courses?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Programs");
  }

  const data = await response.json();
  const programs = data.Programs || data.courses || data.programs || [];
  return { Programs: programs, programs, courses: programs, count: data.count || programs.length };
};

export const fetchProgram = async (
  slug: string,
): Promise<{ Program: Program }> => {
  const response = await fetch(`${API_BASE_URL}/public/courses/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch Program");
  }

  return await response.json();
};

export interface TeacherProfile {
  photo?: string;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  experience: number;
  country: string;
  countryCode: string;
  bio: string;
}

export interface AvailabilitySlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  // New pricing source of truth (USD base)
  pricing?: { baseAmountUSD: number; baseCurrency: "USD" };
  // Derived convenience fields for UI display (USD base only; never trust for checkout)
  price?: number;
  currency?: string;
  timezone: string;
}

export interface TeacherProgram {
  _id: string;
  teacherId: {
    _id: string;
    name: string;
    email: string;
  };
  ProgramId: {
    _id: string;
    name: string;
    description?: string;
  };
  languageIds: Array<{
    _id: string;
    name: string;
    code: string;
    nativeName?: string;
  }>;
  pricing?: {
    basePriceUSD: number;
    baseCurrency: "USD";
    teacherPrice: number;
    teacherCurrency: string;
    exchangeRateAtCreation: number;
  };
  // Derived convenience fields for UI display (USD base only; never trust for checkout)
  price?: number;
  currency?: string;
  timezone: string;
  experience: string;
  bio: string;
  aboutProgram?: string;
  introductionVideo?: string;
  teacherProfile: TeacherProfile;
  availability: AvailabilitySlot[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeachersResponse {
  teachers: TeacherProgram[];
  count: number;
}

export const fetchProgramTeachers = async (
  slug: string,
  params?: {
    startDate?: string;
    endDate?: string;
    currency?: string;
  },
): Promise<TeachersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) {
    queryParams.append("startDate", params.startDate);
  }
  if (params?.endDate) {
    queryParams.append("endDate", params.endDate);
  }
  if (params?.currency) {
    queryParams.append("currency", params.currency);
  }

  const response = await fetch(
    `${API_BASE_URL}/public/courses/${slug}/teachers?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }

  const data = await response.json();
  const teachers = (data.teachers || []).map((t: any) => {
    const basePriceUSD =
      typeof t?.pricing?.basePriceUSD === "number"
        ? t.pricing.basePriceUSD
        : undefined;
    return {
      ...t,
      // Keep existing UI working: treat `price` as USD base for display-only conversions.
      price: typeof t.price === "number" ? t.price : basePriceUSD,
      currency: typeof t.currency === "string" ? t.currency : "USD",
      availability: Array.isArray(t.availability)
        ? t.availability.map((av: any) => ({
            ...av,
            price:
              typeof av.price === "number"
                ? av.price
                : typeof av?.pricing?.baseAmountUSD === "number"
                  ? av.pricing.baseAmountUSD
                  : undefined,
            currency: typeof av.currency === "string" ? av.currency : "USD",
          }))
        : [],
    };
  });
  return { ...data, teachers };
};

export interface AvailabilityResponse {
  availabilities: Array<{
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    pricing?: { baseAmountUSD: number; baseCurrency: "USD" };
    // Derived convenience fields for UI display (USD base only)
    price?: number;
    currency?: string;
    timezone: string;
    displayTimezone?: string;
  }>;
  count: number;
}

export const fetchProgramAvailability = async (
  ProgramId: string,
  params?: {
    teacherId?: string;
    startDate?: string;
    endDate?: string;
    studentTimezone?: string;
  },
): Promise<AvailabilityResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("courseId", ProgramId);
  if (params?.teacherId) {
    queryParams.append("teacherId", params.teacherId);
  }
  if (params?.startDate) {
    queryParams.append("startDate", params.startDate);
  }
  if (params?.endDate) {
    queryParams.append("endDate", params.endDate);
  }
  if (params?.studentTimezone) {
    queryParams.append("studentTimezone", params.studentTimezone);
  }

  const response = await fetch(
    `${API_BASE_URL}/public/courses/availability?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch availability");
  }

  const data = await response.json();
  const availabilities = (data.availabilities || []).map((av: any) => ({
    ...av,
    price:
      typeof av.price === "number"
        ? av.price
        : typeof av?.pricing?.baseAmountUSD === "number"
          ? av.pricing.baseAmountUSD
          : undefined,
    currency: typeof av.currency === "string" ? av.currency : "USD",
  }));
  return { ...data, availabilities };
};

// ================= WORKSHOPS FUNCTIONS =================

export const fetchWorkshops = async (params?: {
  status?: string;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ programs: Program[]; count: number }> => {
  const queryParams = new URLSearchParams();
  queryParams.append("type", "workshop");
  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/public/courses?${queryParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch workshops");
  }

  return response.json();
};

export const fetchWorkshop = async (
  slug: string,
): Promise<{ program: Program }> => {
  const response = await fetch(`${API_BASE_URL}/public/courses/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workshop");
  }

  return response.json();
};

export const registerForWorkshop = async (
  token: string,
  workshopId: string,
  data?: any,
): Promise<{ message: string; registration: any }> => {
  const response = await fetch(`${API_BASE_URL}/bookings/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      courseId: workshopId,
      ...data,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to register for workshop");
  }

  return result;
};
