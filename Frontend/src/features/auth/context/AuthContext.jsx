import { useEffect, useMemo, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser
} from "../services/authApi";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  async function refreshUser() {
    try {
      setIsAuthLoading(true);
      setAuthError("");

      const result = await getCurrentUser();
      setUser(result.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function register(credentials) {
    try {
      setIsAuthLoading(true);
      setAuthError("");

      const result = await registerUser(credentials);
      setUser(result.data.user);

      return result.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to create account";
      setAuthError(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function login(credentials) {
    try {
      setIsAuthLoading(true);
      setAuthError("");

      const result = await loginUser(credentials);
      setUser(result.data.user);

      return result.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to log in";
      setAuthError(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function logout() {
    try {
      setIsAuthLoading(true);
      setAuthError("");

      await logoutUser();
      setUser(null);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to log out";
      setAuthError(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsAuthLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadCurrentUser() {
      try {
        const result = await getCurrentUser();

        if (isActive) {
          setUser(result.data.user);
        }
      } catch {
        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsAuthLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      authError,
      register,
      login,
      logout,
      refreshUser
    }),
    [user, isAuthLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
