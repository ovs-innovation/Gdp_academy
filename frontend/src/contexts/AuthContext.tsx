import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login as loginAPI,
  register as registerAPI,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  validateToken,
} from '../services/authService'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../services/authService'

interface User {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  permissions: string[]
  status: string
  photo?: string
  avatar?: string
  image?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  googleLogin: (credential: string, role?: string, isAccessToken?: boolean) => Promise<void>
//   firebaseLogin: (token: string, role?: string) => Promise<void>
  logout: () => void
  updateUserProfile: (data: any) => Promise<void>
  uploadProfilePhoto: (file: File) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Rehydrate synchronously so a hard refresh never flashes logged-out.
  const [user, setUser] = useState<User | null>(() => getStoredUser() as User | null)
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const didInitAuth = useRef(false)

  useEffect(() => {
    const initAuth = async () => {
      if (didInitAuth.current) return
      didInitAuth.current = true

      const storedToken = getStoredToken()
      const userFromStorage = getStoredUser()

      if (!storedToken) {
        setToken(null)
        setUser(null)
        setIsLoading(false)
        return
      }

      // Keep cached session visible while we revalidate.
      setToken(storedToken)
      if (userFromStorage) {
        setUser(userFromStorage as User)
      }

      const shouldValidateOnStartup =
        !import.meta.env.DEV || import.meta.env.VITE_VALIDATE_AUTH_ON_STARTUP === 'true'

      if (!shouldValidateOnStartup) {
        setIsLoading(false)
        return
      }

      try {
        const result = await validateToken()

        if (result.status === 'ok') {
          setToken(storedToken)
          setUser(result.user as User)
          setStoredUser(result.user)
        } else if (result.status === 'unauthorized') {
          // Real auth failure — clear only here.
          setToken(null)
          setUser(null)
          removeStoredToken()
          removeStoredUser()
        }
        // 'transient': keep stored token/user (network/5xx must not log the user out)
      } catch {
        // Keep cached session on unexpected errors during startup validation.
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await loginAPI(credentials)

      if ('requiresOTP' in response && response.requiresOTP) {
        throw new Error('OTP_REQUIRED')
      }

      const authResponse = response as AuthResponse
      setStoredToken(authResponse.token)
      setStoredUser(authResponse.user)
      setToken(authResponse.token)
      setUser(authResponse.user)

      const role = authResponse.user.role
      if (role === 'admin' || role === 'superadmin' || role === 'super_admin') {
        const adminBase =
          import.meta.env.VITE_ADMIN_URL ||
          `${window.location.protocol}//${window.location.hostname}:8080`
        window.location.href = `${adminBase.replace(/\/$/, '')}/login?token=${authResponse.token}`
        return
      }

      if (role === 'teacher' || role === 'student') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (error) {
      throw error
    }
  }, [navigate])

  const googleLogin = useCallback(async (credential: string, role?: string, isAccessToken?: boolean) => {
    try {
      const { googleLogin: googleLoginAPI } = await import('../services/authService')
      const authResponse = await googleLoginAPI(credential, role, isAccessToken)

      if ('status' in authResponse && (authResponse as any).status === 'pending') {
        navigate('/login', { replace: true })
        return
      }

      if (authResponse.token && authResponse.user) {
        setStoredToken(authResponse.token)
        setStoredUser(authResponse.user)
        setToken(authResponse.token)
        setUser(authResponse.user)

        if (authResponse.user.role === 'teacher' || authResponse.user.role === 'student') {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      }
    } catch (error) {
      throw error
    }
  }, [navigate])

//   const firebaseLogin = useCallback(async (token: string, role?: string) => {
//     try {
//       const { firebaseLogin: firebaseLoginAPI } = await import('../services/authService')
//       const authResponse = await firebaseLoginAPI(token, role)

//       if ('status' in authResponse && (authResponse as any).status === 'pending') {
//         navigate('/login', { replace: true })
//         return
//       }

//       if (authResponse.token && authResponse.user) {
//         setStoredToken(authResponse.token)
//         setStoredUser(authResponse.user)
//         setToken(authResponse.token)
//         setUser(authResponse.user)

//         if (authResponse.user.role === 'teacher') {
//           navigate('/instructor-dashboard', { replace: true })
//         } else if (authResponse.user.role === 'student') {
//           navigate('/my-dashboard', { replace: true })
//         } else {
//           navigate('/', { replace: true })
//         }
//       }
//     } catch (error) {
//       throw error
//     }
//   }, [navigate])

  const register = useCallback(async (userData: RegisterData) => {
    try {
      const authResponse = await registerAPI(userData)
      
      // If registration returns 'pending' status, don't login directly
      if ('status' in authResponse && (authResponse as any).status === 'pending') {
        navigate('/login', { replace: true })
        return
      }
      
      if (authResponse.token && authResponse.user) {
        setStoredToken(authResponse.token)
        setStoredUser(authResponse.user)
        setToken(authResponse.token)
        setUser(authResponse.user)
        
        if (authResponse.user.role === 'teacher' || authResponse.user.role === 'student') {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } else {
         navigate('/login', { replace: true })
      }
    } catch (error) {
      throw error
    }
  }, [navigate])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    removeStoredToken()
    removeStoredUser()
    navigate('/login', { replace: true })
  }, [navigate])

  const updateUserProfile = useCallback(async (data: any) => {
      try {
          const { updateProfile } = await import('../services/authService');
          const updatedUser = await updateProfile(data);
          setStoredUser(updatedUser);
          setUser(updatedUser);
      } catch (err) {
          console.error("Failed to update profile", err);
          throw err;
      }
  }, []);

  const uploadProfilePhoto = useCallback(async (file: File) => {
      try {
          const { uploadProfilePhotoToServer } = await import('../services/authService');
          const updatedUser = await uploadProfilePhotoToServer(file);
          setStoredUser(updatedUser);
          setUser(updatedUser);
      } catch (err) {
          console.error("Failed to upload profile photo", err);
          throw err;
      }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        googleLogin,
//         firebaseLogin,
        logout,
        updateUserProfile,
        uploadProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


