import { Permission, Role } from "./rbac";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export const TOKEN_KEY = "admin-auth-token";
export const ROLE_KEY = "admin-role";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  status: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface ApiRole {
  id: string;
  name: string;
  key: string;
  permissions: Permission[];
  createdAt?: string;
}

const getToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

const getHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/** Typed API failure so callers can distinguish 401 from network/5xx. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));

  // Wipe token only on definitive unauthorized responses.
  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    throw new ApiError(data.message || "Request failed", response.status);
  }
  return data as T;
};

export const AuthAPI = {
  login: (payload: { email: string; password: string; otp?: string }) =>
    apiFetch<{ token?: string; user?: ApiUser; requiresOTP?: boolean; message?: string }>("/auth/login?appType=admin", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    apiFetch<{ token: string; user: ApiUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  forgot: (payload: { email: string }) =>
    apiFetch<{ message: string }>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  reset: (payload: { email: string; otp: string; password: string }) =>
    apiFetch<{ success?: boolean; message: string }>("/auth/reset", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => apiFetch<{ user: ApiUser }>("/auth/me"),
};

export const UsersAPI = {
  list: () => apiFetch<{ users: ApiUser[] }>("/users"),
  create: (payload: { name: string; email: string; password: string; role?: string; status?: string }) =>
    apiFetch<{ user: ApiUser }>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: { name?: string; email?: string; password?: string; role?: string; status?: string }) =>
    apiFetch<{ user: ApiUser }>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    apiFetch<{ success: boolean }>(`/users/${id}`, {
      method: "DELETE",
    }),
};

export const RolesAPI = {
  list: () => apiFetch<{ roles: ApiRole[]; permissions: Permission[] }>("/roles"),
  create: (payload: { name: string; key?: string; permissions: Permission[] }) =>
    apiFetch<{ role: ApiRole }>("/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: { name?: string; permissions?: Permission[] }) =>
    apiFetch<{ role: ApiRole }>(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export interface ApiSettings {
  siteName: string;
  siteUrl: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: boolean;
  ipWhitelist: boolean;
  themeColor: string;
  compactMode: boolean;
  platformFeePercent?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  finalCtaTitle?: string;
  finalCtaSubtitle?: string;
  whatsappNumber?: string;
  announcementText?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
}

export const SettingsAPI = {
  get: () => apiFetch<{ settings: ApiSettings }>("/settings"),
  update: (payload: Partial<ApiSettings>) =>
    apiFetch<{ settings: ApiSettings }>("/settings", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export interface ApiTeacherProfile {
  _id: string;
  userId: ApiUser | string;
  bio: string;
  aboutUs?: string;
  photo?: string;
  expertise: string[];
  experience: number;
  country?: string;
  countryCode?: string;
  kycStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  payoutInfo: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    upiId?: string;
  };
  totalEarnings: number;
  pendingPayout?: number;
  paidAmount?: number;
  rating: number;
  totalReviews: number;
  totalPrograms?: number;
  publishedPrograms?: number;
  totalMembers?: number;
  createdAt?: string;
  updatedAt?: string;
}



export const TeacherProfileAPI = {
  getMyProfile: () => apiFetch<{ profile: ApiTeacherProfile }>("/teacher-profiles/me"),
  getProfile: (userId: string) => apiFetch<{ profile: ApiTeacherProfile }>(`/teacher-profiles/${userId}`),
  list: () => apiFetch<{ profiles: ApiTeacherProfile[]; count: number }>("/teacher-profiles"),
  update: (userId: string, payload: {
    bio?: string | { en: string };
    aboutUs?: string | { en: string };
    expertise?: string[];
    experience?: number;
    kycStatus?: "pending" | "verified" | "rejected";
    rejectionReason?: string;
    payoutInfo?: Partial<ApiTeacherProfile["payoutInfo"]>;
    rating?: number;
  }) =>
    apiFetch<{ profile: ApiTeacherProfile }>(`/teacher-profiles/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  updateMyProfile: (payload: {
    bio?: string | { en: string };
    aboutUs?: string | { en: string };
    photo?: string;
    expertise?: string[];
    experience?: number;
    country?: string;
    countryCode?: string;
    socialLinks?: Partial<ApiTeacherProfile["socialLinks"]>;
    payoutInfo?: Partial<ApiTeacherProfile["payoutInfo"]>;
  }) =>
    apiFetch<{ profile: ApiTeacherProfile }>("/teacher-profiles/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  updateKyc: (userId: string, kycStatus: "pending" | "verified" | "rejected", rejectionReason?: string) =>
    apiFetch<{ profile: ApiTeacherProfile }>(`/teacher-profiles/${userId}/kyc`, {
      method: "PATCH",
      body: JSON.stringify({ kycStatus, rejectionReason }),
    }),
  updateEarnings: (userId: string, amount: number, operation: "add" | "set" = "add") =>
    apiFetch<{ profile: ApiTeacherProfile }>(`/teacher-profiles/${userId}/earnings`, {
      method: "PATCH",
      body: JSON.stringify({ amount, operation }),
    }),
};

export interface ApiStudentProfile {
  _id: string;
  userId: ApiUser | string;
  photo?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    github?: string;
  };
  progress: {
    totalCourses: number;
    totalHoursSpent: number;
    totalLessonsBooked: number;
    totalLessonsCompleted: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const StudentProfileAPI = {
  getMyProfile: () => apiFetch<{ profile: ApiStudentProfile }>("/student-profiles/me"),
  getProfile: (userId: string) => apiFetch<{ profile: ApiStudentProfile }>(`/student-profiles/${userId}`),
  list: () => apiFetch<{ profiles: ApiStudentProfile[]; count: number }>("/student-profiles"),
  update: (userId: string, payload: {
    photo?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    timezone?: string;
    socialLinks?: Partial<ApiStudentProfile["socialLinks"]>;
  }) =>
    apiFetch<{ profile: ApiStudentProfile }>(`/student-profiles/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  updateMyProfile: (payload: {
    photo?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    timezone?: string;
    socialLinks?: Partial<ApiStudentProfile["socialLinks"]>;
  }) =>
    apiFetch<{ profile: ApiStudentProfile }>("/student-profiles/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  recalculateProgress: (userId: string) =>
    apiFetch<{ profile: ApiStudentProfile; progress: any }>((`/student-profiles/${userId}/recalculate-progress`), {
      method: "POST"
    }),
};

// Aliases for MemberProfile to support the renamed Members page
export type ApiMemberProfile = ApiStudentProfile;
export const MemberProfileAPI = StudentProfileAPI;

export const setToken = (token: string, remember = true) => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// ==================== Course Management APIs ====================

export interface RecordedClassItem {
  title?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
}

export interface ApiProgram {
  _id: string;
  name: string | { en: string };
  description: string | { en: string };
  category: string;
  image: string;
  slug?: string;
  status: "active" | "inactive" | "pending";
  danceStyle?: string;
  DanceStyle?: string;
  type: "program" | "workshop";
  price?: number;
  workshopDate?: string;
  workshopTime?: string;
  workshopEndTime?: string;
  zoomLink?: string;
  workshopBanner?: string;
  recordedClasses?: RecordedClassItem[];
  previewVideo?: string;
  createdBy: ApiUser | string;
  createdAt?: string;
  updatedAt?: string;
}

export const ProgramsAPI = {
  list: (type?: "program" | "workshop") => {
    const query = type ? `?type=${type}` : "";
    return apiFetch<{ courses: ApiProgram[]; Programs?: ApiProgram[]; programs?: ApiProgram[]; count: number }>(`/admin/courses${query}`);
  },
  get: (id: string) => apiFetch<{ course: ApiProgram }>(`/admin/courses/${id}`),
  create: (payload: {
    name: string | { en: string };
    description?: string | { en: string };
    category?: string;
    image?: string;
    status?: "active" | "inactive" | "pending";
    danceStyle?: string;
    type?: "program" | "workshop";
    price?: number;
    workshopDate?: string;
    workshopTime?: string;
    workshopEndTime?: string;
    zoomLink?: string;
    workshopBanner?: string;
    recordedClasses?: RecordedClassItem[];
    previewVideo?: string;
  }) =>
    apiFetch<{ course: ApiProgram }>("/admin/courses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: {
    name?: string | { en: string };
    description?: string | { en: string };
    category?: string;
    image?: string;
    status?: "active" | "inactive" | "pending";
    danceStyle?: string;
    type?: "program" | "workshop";
    price?: number;
    workshopDate?: string;
    workshopTime?: string;
    workshopEndTime?: string;
    zoomLink?: string;
    workshopBanner?: string;
    recordedClasses?: RecordedClassItem[];
    previewVideo?: string;
  }) =>
    apiFetch<{ course: ApiProgram }>(`/admin/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/courses/${id}`, {
      method: "DELETE",
    }),
};

// ==================== Category Management APIs ====================

export interface ApiDanceStyle {
  _id: string;
  name: string | { en: string };
  description?: string | { en: string };
  image?: string;
  slug?: string;
  status: "active" | "inactive";
  createdBy: ApiUser | string;
  createdAt?: string;
  updatedAt?: string;
}

export const DanceStylesAPI = {
  list: (status?: "active" | "inactive") => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ categories: ApiDanceStyle[]; count: number }>(`/admin/categories${query}`);
  },
  get: (id: string) => apiFetch<{ category: ApiDanceStyle }>(`/admin/categories/${id}`),
  create: (payload: {
    name: string | { en: string };
    description?: string | { en: string };
    image?: string;
    status?: "active" | "inactive";
  }) =>
    apiFetch<{ category: ApiDanceStyle }>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: {
    name?: string | { en: string };
    description?: string | { en: string };
    image?: string;
    status?: "active" | "inactive";
  }) =>
    apiFetch<{ category: ApiDanceStyle }>(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
      method: "DELETE",
    }),
};

export interface ApiEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  whatsappConsent?: boolean;
  source: "program" | "workshop" | "contact_form" | "general";
  status: "new" | "in_progress" | "closed";
  programId?: ApiProgram | string | null;
  workshopId?: ApiProgram | string | null;
  notes?: string;
  assignedTo?: { _id: string; name: string; email: string; role?: string } | string | null;
  assignedBy?: { _id: string; name: string; email: string } | string | null;
  assignedAt?: string | null;
  closedBy?: { _id: string; name: string; email: string } | string | null;
  closedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEnquiryStats {
  total: number;
  newEnquiries: number;
  inProgress: number;
  closed: number;
  unassigned: number;
  mine: number;
  bySource: Array<{ _id: string; count: number }>;
  byAssignee: Array<{ _id: string; count: number; name?: string; email?: string }>;
  scoped: boolean;
}

export const EnquiriesAPI = {
  list: (params?: {
    status?: string;
    source?: string;
    search?: string;
    assignedTo?: string;
    unassigned?: boolean;
    mine?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.source) query.append("source", params.source);
    if (params?.search) query.append("search", params.search);
    if (params?.assignedTo) query.append("assignedTo", params.assignedTo);
    if (params?.unassigned) query.append("unassigned", "true");
    if (params?.mine) query.append("mine", "true");
    if (params?.page) query.append("page", String(params.page));
    query.append("limit", String(params?.limit ?? 200));
    const suffix = `?${query.toString()}`;
    return apiFetch<{ enquiries: ApiEnquiry[]; total: number; pages: number; currentPage: number }>(
      `/enquiries${suffix}`,
    );
  },
  stats: () => apiFetch<ApiEnquiryStats>("/enquiries/stats"),
  update: (
    id: string,
    payload: {
      status?: ApiEnquiry["status"];
      notes?: string;
      assignedTo?: string | null;
    },
  ) =>
    apiFetch<{ enquiry: ApiEnquiry; message: string }>(`/enquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/enquiries/${id}`, {
      method: "DELETE",
    }),
};

export interface ApiGallery {
  _id: string;
  title: string;
  description?: string;
  category: string;
  isActive: boolean;
  items: Array<{ _id?: string; url: string; type?: "image" | "video"; alt?: string; caption?: string; order?: number }>;
  createdAt?: string;
}

export const GalleryAPI = {
  list: () => apiFetch<{ galleries: ApiGallery[]; total: number }>("/gallery?isActive=all&limit=100"),
  create: (payload: Partial<ApiGallery>) =>
    apiFetch<{ gallery: ApiGallery; message: string }>("/gallery", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiGallery>) =>
    apiFetch<{ gallery: ApiGallery; message: string }>(`/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/gallery/${id}`, {
      method: "DELETE",
    }),
};

// ==================== Language Management APIs ====================

export interface ApiLanguage {
  _id: string;
  name: string | { en: string };
  code: string;
  nativeName: string | { en: string };
  flag: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export const LanguagesAPI = {
  list: () => apiFetch<{ languages: ApiLanguage[]; count: number }>("/admin/languages"),
  get: (id: string) => apiFetch<{ language: ApiLanguage }>(`/admin/languages/${id}`),
  create: (payload: {
    name: string;
    code: string;
    nativeName?: string;
    flag?: string;
    status?: "active" | "inactive";
  }) =>
    apiFetch<{ language: ApiLanguage }>("/admin/languages", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: {
    name?: string;
    code?: string;
    nativeName?: string;
    flag?: string;
    status?: "active" | "inactive";
  }) =>
    apiFetch<{ language: ApiLanguage }>(`/admin/languages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/languages/${id}`, {
      method: "DELETE",
    }),
};

// ==================== Teacher Course Management APIs ====================

export interface ApiTeacherProgram {
  _id: string;
  teacherId: ApiUser | string;
  ProgramId: ApiProgram | string;
  courseId?: ApiProgram | string;
  languageIds: ApiLanguage[] | string[];
  languageProficiencies?: Array<{
    languageId: string | ApiLanguage;
    code: string;
    proficiency: "native" | "c2" | "c1" | "b2" | "b1" | "a2" | "a1";
  }>;
  pricing: {
    basePriceUSD: number;
    baseCurrency: "USD";
    teacherPrice: number;
    teacherCurrency: string;
    exchangeRateAtCreation: number;
  };
  timezone: string;
  experience: string;
  bio: string;
  introductionVideo?: string;
  aboutCourse?: string;
  availability: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: ApiUser | string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const TeacherProgramsAPI = {
  list: (params?: {
    status?: "pending" | "approved" | "rejected";
    courseId?: string;
    languageId?: string;
    teacherId?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.courseId) query.append("courseId", params.courseId);
    if (params?.languageId) query.append("languageId", params.languageId);
    if (params?.teacherId) query.append("teacherId", params.teacherId);
    const queryString = query.toString();
    return apiFetch<{ teacherPrograms: ApiTeacherProgram[]; count: number }>(
      `/admin/teacher-course${queryString ? `?${queryString}` : ""}`
    );
  },
  approve: (id: string) =>
    apiFetch<{ teacherCourse: ApiTeacherProgram; message: string }>(`/admin/teacher-course/${id}/approve`, {
      method: "PATCH",
    }),
  reject: (id: string, rejectionReason?: string) =>
    apiFetch<{ teacherCourse: ApiTeacherProgram; message: string }>(`/admin/teacher-course/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected", rejectionReason }),
    }),
  update: (id: string, payload: { customPlatformFeePercent?: number }) =>
    apiFetch<{ teacherCourse: ApiTeacherProgram; message: string }>(`/admin/teacher-course/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

// ==================== Teacher Course Join APIs ====================

export const TeacherProgramJoinAPI = {
  getAvailablePrograms: () => apiFetch<{ courses: ApiProgram[]; count: number }>("/teacher/available-courses"),
  getLanguages: () => apiFetch<{ languages: ApiLanguage[]; count: number }>("/teacher/languages"),
  joinProgram: (payload: {
    ProgramId: string;
    languageIds?: string[];
    languageCodes?: string[];
    languages?: Array<{
      code: string;
      proficiency: "native" | "c2" | "c1" | "b2" | "b1" | "a2" | "a1";
      name?: any;
      nativeName?: any;
    }>;
    teacherPrice: number;
    teacherCurrency: string;
    timezone?: string;
    introductionVideo?: string;
    experience?: string;
    bio?: string;
    aboutProgram?: string;
  }) =>
    apiFetch<{ teacherCourse: ApiTeacherProgram; message?: string }>("/teacher/course-join", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMyPrograms: (status?: "pending" | "approved" | "rejected") => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ teacherCourses: ApiTeacherProgram[]; count: number }>(`/teacher/my-courses${query}`);
  },
  updateProgram: (id: string, payload: {
    languageIds?: string[];
    languageCodes?: string[];
    languages?: Array<{
      code: string;
      proficiency: "native" | "c2" | "c1" | "b2" | "b1" | "a2" | "a1";
      name?: any;
      nativeName?: any;
    }>;
    teacherPrice?: number;
    teacherCurrency?: string;
    timezone?: string;
    introductionVideo?: string;
    experience?: string;
    bio?: string;
    aboutProgram?: string;
  }) =>
    apiFetch<{ teacherCourse: ApiTeacherProgram; message: string }>(`/teacher/my-courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  exitProgram: (id: string) =>
    apiFetch<{ message: string }>(`/teacher/my-courses/${id}`, {
      method: "DELETE",
    }),
};

// ==================== Student Course Browsing APIs ====================

export const StudentProgramsAPI = {
  getCourses: () => apiFetch<{ courses: ApiProgram[]; count: number }>("/courses"),
  getCourseLanguages: (courseId: string) =>
    apiFetch<{ languages: ApiLanguage[]; count: number }>(`/courses/${courseId}/languages`),
  getCourseTeachers: (courseId: string, languageId: string) =>
    apiFetch<{ teacherCourses: ApiTeacherProgram[]; count: number }>(
      `/courses/${courseId}/teachers?languageId=${languageId}`
    ),
};

// ==================== Availability Management APIs ====================

export interface ApiAvailability {
  _id: string;
  teacherId: ApiUser | string;
  courseId: ApiProgram | string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  pricing: {
    baseAmountUSD: number;
    baseCurrency: "USD";
  };
  timezone: string;
  status: "available" | "booked" | "blocked" | "cancelled";
  bookingId?: string;
  isRecurring: boolean;
  recurringPattern?: "daily" | "weekly" | "monthly" | null;
  recurringEndDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AvailabilityAPI = {
  create: (payload: {
    courseId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    timezone?: string;
    isRecurring?: boolean;
    recurringPattern?: "daily" | "weekly" | "monthly";
    recurringEndDate?: string;
  }) =>
    apiFetch<{ availability: ApiAvailability }>("/teacher/availability", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  bulkCreate: (payload: {
    courseId: string;
    slots: Array<{
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
      timezone?: string;
    }>;
  }) =>
    apiFetch<{ availabilities: ApiAvailability[]; count: number }>("/teacher/availability/bulk", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMyAvailability: (params?: {
    courseId?: string;
    startDate?: string;
    endDate?: string;
    status?: "available" | "booked" | "blocked" | "cancelled";
  }) => {
    const query = new URLSearchParams();
    if (params?.courseId) query.append("courseId", params.courseId);
    if (params?.startDate) query.append("startDate", params.startDate);
    if (params?.endDate) query.append("endDate", params.endDate);
    if (params?.status) query.append("status", params.status);
    const queryString = query.toString();
    return apiFetch<{ availabilities: ApiAvailability[]; count: number }>(
      `/teacher/availability${queryString ? `?${queryString}` : ""}`
    );
  },
  update: (id: string, payload: {
    startTime?: string;
    endTime?: string;
    duration?: number;
    status?: "available" | "booked" | "blocked" | "cancelled";
    timezone?: string;
  }) =>
    apiFetch<{ availability: ApiAvailability }>(`/teacher/availability/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/teacher/availability/${id}`, {
      method: "DELETE",
    }),
};

// ==================== Booking APIs ====================

export interface ApiBooking {
  _id: string;
  studentId: ApiUser | string;
  teacherId: ApiUser | string;
  teacherCourseId: ApiTeacherProgram | string;
  availabilityId: string;
  courseId: ApiProgram | string;
  languageId: ApiLanguage | string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  timezone: string;
  pricingSnapshot: {
    baseAmountUSD: number;
    baseCurrency: "USD";
    studentPaid: { amount: number; currency: string };
    teacherPayout: { amount: number; currency: string };
    exchangeRates: Record<string, number>;
    timestamp: string;
  };
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  // Legacy fields (for backward compatibility)
  meetingType: "zoom" | "google_meet" | "teams" | "custom";
  meetingUrl: string;
  meetingId: string;
  meetingPassword: string;
  // New meeting object with dynamic Zoom links
  meeting?: {
    provider: "zoom";
    meetingId: string;
    joinUrlStudent: string;
    joinUrlTeacher: string;
  };
  cancelledBy?: ApiUser | string;
  cancelledAt?: string;
  cancellationReason?: string;
  studentNotes: string;
  teacherNotes: string;
  createdAt?: string;
  updatedAt?: string;
}

export const BookingAPI = {
  // Student APIs
  getAvailableSlots: (teacherCourseId: string, params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append("startDate", params.startDate);
    if (params?.endDate) query.append("endDate", params.endDate);
    const queryString = query.toString();
    return apiFetch<{ availabilities: ApiAvailability[]; count: number }>(
      `/bookings/available-slots/${teacherCourseId}${queryString ? `?${queryString}` : ""}`
    );
  },
  create: (payload: { availabilityId: string; studentNotes?: string }) =>
    apiFetch<{ booking: ApiBooking; message: string }>("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMyBookings: (params?: {
    status?: "scheduled" | "completed" | "cancelled" | "no_show";
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.startDate) query.append("startDate", params.startDate);
    if (params?.endDate) query.append("endDate", params.endDate);
    const queryString = query.toString();
    return apiFetch<{ bookings: ApiBooking[]; count: number }>(
      `/bookings/my-bookings${queryString ? `?${queryString}` : ""}`
    );
  },
  getBooking: (id: string) => apiFetch<{ booking: ApiBooking }>(`/bookings/${id}`),
  updateStatus: (id: string, payload: {
    status: "scheduled" | "completed" | "cancelled" | "no_show";
    cancellationReason?: string;
  }) =>
    apiFetch<{ booking: ApiBooking; message: string }>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Teacher APIs
  getTeacherBookings: (params?: {
    status?: "scheduled" | "completed" | "cancelled" | "no_show";
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.startDate) query.append("startDate", params.startDate);
    if (params?.endDate) query.append("endDate", params.endDate);
    const queryString = query.toString();
    return apiFetch<{ bookings: ApiBooking[]; count: number }>(
      `/teacher/bookings${queryString ? `?${queryString}` : ""}`
    );
  },
  updateMeetingDetails: (id: string, payload: {
    meetingType?: "zoom" | "google_meet" | "teams" | "custom";
    meetingUrl?: string;
    meetingId?: string;
    meetingPassword?: string;
  }) =>
    apiFetch<{ booking: ApiBooking; message: string }>(`/teacher/bookings/${id}/meeting`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  updateTeacherStatus: (id: string, payload: {
    status: "scheduled" | "completed" | "cancelled" | "no_show";
    teacherNotes?: string;
  }) =>
    apiFetch<{ booking: ApiBooking; message: string }>(`/teacher/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

// ==================== New CMS APIs ====================

export interface ApiFAQ {
  _id: string;
  question: string | Record<string, string>;
  answer: string | Record<string, string>;
  order: number;
  status: "published" | "draft" | "archived";
  createdAt?: string;
}

export const FAQAPI = {
  list: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ faqs: ApiFAQ[]; total: number; pages: number }>(`/faqs${query}`);
  },
  create: (payload: Partial<ApiFAQ>) =>
    apiFetch<{ faq: ApiFAQ; message: string }>("/faqs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiFAQ>) =>
    apiFetch<{ faq: ApiFAQ; message: string }>(`/faqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/faqs/${id}`, {
      method: "DELETE",
    }),
  reorder: (faqs: Array<{ id: string; order: number }>) =>
    apiFetch<{ message: string }>("/faqs/reorder", {
      method: "PUT",
      body: JSON.stringify({ faqs }),
    }),
};

export interface ApiMembershipPlan {
  _id: string;
  title: string | Record<string, string>;
  price: number;
  currency: string;
  duration: number;
  durationUnit: "month" | "year";
  features: string[];
  order: number;
  status: "published" | "draft" | "archived";
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  createdAt?: string;
}

export const MembershipPlansAPI = {
  list: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ plans: ApiMembershipPlan[]; total: number; pages: number }>(`/membership-plans${query}`);
  },
  create: (payload: Partial<ApiMembershipPlan>) =>
    apiFetch<{ plan: ApiMembershipPlan; message: string }>("/membership-plans", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiMembershipPlan>) =>
    apiFetch<{ plan: ApiMembershipPlan; message: string }>(`/membership-plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/membership-plans/${id}`, {
      method: "DELETE",
    }),
  reorder: (plans: Array<{ id: string; order: number }>) =>
    apiFetch<{ message: string }>("/membership-plans/reorder", {
      method: "PUT",
      body: JSON.stringify({ plans }),
    }),
};

export interface ApiContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  source?: string;
  status: "new" | "read" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

export const ContactMessagesAPI = {
  list: (status?: string) => {
    const params = new URLSearchParams({ limit: "200" });
    if (status) params.append("status", status);
    return apiFetch<{ messages: ApiContactMessage[]; total: number; pages: number }>(`/contact-messages?${params.toString()}`);
  },
  updateStatus: (id: string, status: "new" | "read" | "closed") =>
    apiFetch<{ contact: ApiContactMessage; message: string }>(`/contact-messages/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/contact-messages/${id}`, {
      method: "DELETE",
    }),
};

export interface ApiPageContent {
  _id: string;
  slug: string;
  title: string | Record<string, string>;
  content: any;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: "published" | "draft" | "archived";
  order: number;
}

export const PageContentAPI = {
  list: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ pages: ApiPageContent[]; total: number; pages_count: number }>(`/page-contents${query}`);
  },
  getBySlug: (slug: string) => apiFetch<{ page: ApiPageContent }>(`/page-contents/slug/${slug}`),
  getById: (id: string) => apiFetch<{ page: ApiPageContent }>(`/page-contents/${id}`),
  create: (payload: Partial<ApiPageContent>) =>
    apiFetch<{ page: ApiPageContent; message: string }>("/page-contents", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiPageContent>) =>
    apiFetch<{ page: ApiPageContent; message: string }>(`/page-contents/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/page-contents/${id}`, {
      method: "DELETE",
    }),
};

export interface ApiGalleryItem {
  _id: string;
  type: "image" | "video";
  url: string;
  caption?: string | Record<string, string>;
  order: number;
  status: "published" | "draft" | "archived";
  createdAt?: string;
}

export const GalleryItemAPI = {
  list: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ items: ApiGalleryItem[]; total: number; pages: number }>(`/gallery-items${query}`);
  },
  create: (payload: Partial<ApiGalleryItem>) =>
    apiFetch<{ item: ApiGalleryItem; message: string }>("/gallery-items", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiGalleryItem>) =>
    apiFetch<{ item: ApiGalleryItem; message: string }>(`/gallery-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/gallery-items/${id}`, {
      method: "DELETE",
    }),
  reorder: (items: Array<{ id: string; order: number }>) =>
    apiFetch<{ message: string }>("/gallery-items/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    }),
};

export interface ApiSiteSettings {
  _id: string;
  logoUrl?: string;
  navLinks: Array<{ label: string; href: string }>;
  footerLinks?: Array<{ label: string; href: string }>;
  footerServiceLinks?: Array<{ label: string; href: string }>;
  footerText?: string;
  footerTagline?: string;
  brandLine1?: string;
  brandLine2?: string;
  brandLine3?: string;
  headerCtaLabel?: string;
  headerCtaUrl?: string;
  socialLinks: Array<{ platform: string; url: string }>;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  whatsappNumber?: string;
  announcementBar?: {
    enabled?: boolean;
    text?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const SiteSettingsAPI = {
  get: () => apiFetch<{ settings: ApiSiteSettings }>("/site-settings"),
  update: (payload: Partial<ApiSiteSettings>) =>
    apiFetch<{ settings: ApiSiteSettings }>("/site-settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

export interface ApiCMSContent {
  _id: string;
  key: string;
  section: string;
  title: string | Record<string, string>;
  description?: string | Record<string, string>;
  content?: any;
  images?: Array<{ url: string; alt: string; order: number }>;
  videos?: Array<{ url: string; title: string; order: number }>;
  metadata?: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
  };
  isActive: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CMSAPI = {
  list: (params?: { section?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.section) query.append("section", params.section);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    const queryString = query.toString();
    return apiFetch<{ cms: ApiCMSContent[]; total: number; pages: number }>(
      `/cms${queryString ? `?${queryString}` : ""}`
    );
  },
  getByKey: (key: string) => apiFetch<ApiCMSContent>(`/cms/key/${key}`),
  getBySection: (section: string) => apiFetch<ApiCMSContent[]>(`/cms/section/${section}`),
  save: (payload: Partial<ApiCMSContent>) =>
    apiFetch<{ message: string; cms: ApiCMSContent }>("/cms", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/cms/${id}`, {
      method: "DELETE",
    }),
};

export interface ApiTestimonial {
  _id: string;
  name: string;
  position?: string;
  message: string | Record<string, string>;
  image?: string;
  rating: number;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export const TestimonialAPI = {
  list: (params?: { isActive?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.isActive) query.append("isActive", params.isActive);
    if (params?.limit) query.append("limit", params.limit.toString());
    const qs = query.toString();
    return apiFetch<{ testimonials: ApiTestimonial[]; total: number; pages: number }>(
      `/testimonials${qs ? `?${qs}` : ""}`
    );
  },
  create: (payload: Partial<ApiTestimonial>) =>
    apiFetch<{ testimonial: ApiTestimonial; message: string }>("/testimonials", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiTestimonial>) =>
    apiFetch<{ testimonial: ApiTestimonial; message: string }>(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/testimonials/${id}`, {
      method: "DELETE",
    }),
  reorder: (testimonials: Array<{ id: string; order: number }>) =>
    apiFetch<{ message: string }>("/testimonials/reorder", {
      method: "POST",
      body: JSON.stringify({ testimonials }),
    }),
};

export interface ApiBlog {
  _id: string;
  title: string | Record<string, string>;
  slug: string;
  excerpt?: string | Record<string, string>;
  content: string | Record<string, string>;
  featuredImage?: { url: string; alt?: string };
  category?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  views?: number;
  publishedAt?: string;
  createdAt?: string;
}

export const BlogAPI = {
  list: (params?: { status?: string; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status !== undefined) query.append("status", params.status);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    const qs = query.toString();
    return apiFetch<{ blogs: ApiBlog[]; total: number; pages: number }>(
      `/blogs${qs ? `?${qs}` : ""}`
    );
  },
  create: (payload: Partial<ApiBlog>) =>
    apiFetch<{ blog: ApiBlog; message: string }>("/blogs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ApiBlog>) =>
    apiFetch<{ blog: ApiBlog; message: string }>(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/blogs/${id}`, {
      method: "DELETE",
    }),
};

export const IntegrationsAPI = {
  status: () =>
    apiFetch<{
      integrations: {
        mode: string;
        payment: { demo: boolean; razorpay: boolean; phonepe: boolean };
        zoom: { demo: boolean; configured: boolean };
        recording: { demo: boolean; configured: boolean };
      };
    }>("/integrations/status"),
};

export const ZoomAPI = {
  ensureWorkshopLink: (workshopId: string) =>
    apiFetch<{ success: boolean; zoomLink: string; mode: string }>(
      `/zoom/workshops/${workshopId}/ensure-link`,
      { method: "POST" },
    ),
};


