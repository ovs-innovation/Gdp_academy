import { API_BASE_URL } from "../lib/apiConfig";

// ================= TYPES =================
export interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    status: string;
    photo?: string;
    avatar?: string;
    image?: string;
  };
}

export interface OTPResponse {
  requiresOTP: boolean;
  message: string;
}

// ================= LOGIN =================
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse | OTPResponse> => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Timezone": timezone,
    },
    body: JSON.stringify({
      ...credentials,
      timezone,
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Server Error (${response.status}): ${text.substring(0, 50)}`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// ================= REGISTER =================
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...userData,
      role: userData.role || "student",
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Server Error (${response.status}): ${text.substring(0, 50)}`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

// ================= TOKEN STORAGE =================
export const getStoredToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem("auth_token");
};

export const getStoredUser = (): AuthResponse["user"] | null => {
  const userStr = localStorage.getItem("auth_user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user: AuthResponse["user"]): void => {
  localStorage.setItem("auth_user", JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem("auth_user");
};

// ================= PROFILE =================
export const updateProfile = async (data: Record<string, unknown>) => {
  const token = getStoredToken()
  const currentUser = getStoredUser()

  if (!token) {
    throw new Error('You must be logged in to update your profile.')
  }

  const payload: Record<string, unknown> = {}
  if (data.photo !== undefined) payload.photo = data.photo
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.timezone !== undefined) payload.timezone = data.timezone
  if (data.location !== undefined) {
    const loc = String(data.location)
    const parts = loc.split(',').map((p) => p.trim())
    if (parts[0]) payload.city = parts[0]
    if (parts[1]) payload.country = parts[1]
  }

  const response = await fetch(`${API_BASE_URL}/student-profiles/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const resData = await response.json()

  if (!response.ok) {
    throw new Error(resData.message || 'Update failed')
  }

  const profile = resData.profile ?? resData
  const photo =
    resData.photo ||
    (profile && typeof profile === 'object' && 'photo' in profile
      ? (profile as { photo?: string }).photo
      : undefined) ||
    (data.photo as string | undefined)

  const updatedUser = {
    ...currentUser,
    ...data,
    photo,
    profile,
  }

  setStoredUser(updatedUser as AuthResponse['user'])
  return updatedUser as AuthResponse['user']
}

export const uploadProfilePhotoToServer = async (file: File) => {
  const { uploadProfilePhoto } = await import('../utils/uploadProfilePhoto')
  await uploadProfilePhoto(file)
  const currentUser = getStoredUser()
  if (!currentUser) {
    throw new Error('Could not refresh user after upload.')
  }
  return currentUser as AuthResponse['user']
}

// ================= VALIDATE TOKEN =================
/** Distinguishes real auth failure from transient network/server errors. */
export type TokenValidationResult =
  | { status: "ok"; user: AuthResponse["user"] }
  | { status: "unauthorized" }
  | { status: "transient" };

export const validateToken = async (): Promise<TokenValidationResult> => {
  const token = getStoredToken();
  if (!token) return { status: "unauthorized" };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Only definitive auth failures should wipe the session.
    if (response.status === 401 || response.status === 403) {
      removeStoredToken();
      removeStoredUser();
      return { status: "unauthorized" };
    }

    if (!response.ok) {
      return { status: "transient" };
    }

    const data = await response.json();
    return { status: "ok", user: data.user || data };
  } catch {
    // Network / CORS / offline — keep stored session for refresh survival.
    return { status: "transient" };
  }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (
  credential: string,
  role?: string,
  isAccessToken?: boolean
): Promise<AuthResponse> => {
  const body: any = { role };

  if (isAccessToken) {
    body.accessToken = credential;
  } else {
    body.credential = credential;
  }

  const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Google login failed");
  }

  return data;
};

// export const firebaseLogin = async (token: string, role?: string): Promise<AuthResponse> => {
//   const response = await fetch(`${API_BASE_URL}/auth/firebase-login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ token, role }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Firebase login failed");
//   }

//   return data;
// };
