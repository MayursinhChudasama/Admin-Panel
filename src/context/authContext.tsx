import React, { createContext, useReducer, useEffect, useState } from "react";
// import axios from "axios";
import { API_URL } from "../common/constant";
import Cookies from "js-cookie";

interface AuthContextType {
  state: any;
  loadUser: () => Promise<void>;
  dispatch: React.Dispatch<any>;
  authChecked: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const initialState = {
  accessToken: Cookies.get("A_accessToken"),
  refreshToken: Cookies.get("A_refreshToken"),
  isAuthenticated: null,
  loading: false,
  user: null,
  error: null,
};

export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOAD_USER":
      return {
        ...state,
        loading: true,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        error: null,
      };
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      Cookies.set("A_accessToken", action.payload.accessToken, { expires: 1 });
      Cookies.set("A_refreshToken", action.payload.refreshToken, {
        expires: 1,
      });
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT":
    case "REGISTER_FAIL":
      Cookies.remove("A_accessToken");
      Cookies.remove("A_refreshToken");
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
const adminKey = process.env.REACT_APP_ADMIN_KEY;
if (!adminKey) {
  throw new Error("Admin key is not configured");
}
// Define a type for our specific headers
type AuthHeaders = {
  Authorization: string;
  "admin-key": string;
  [key: string]: string; // This makes it compatible with HeadersInit
};
const headers: AuthHeaders = {
  Authorization: `Bearer ${Cookies.get("A_accessToken") || ""}`,
  "admin-key": adminKey,
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [authChecked, setAuthChecked] = useState(false);

  const loadUser = async () => {
    dispatch({ type: "LOAD_USER" });
    try {
      const res = await fetch(`${API_URL}/admin`, {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      dispatch({ type: "USER_LOADED", payload: data.data });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" });
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    if (Cookies.get("A_accessToken")) {
      loadUser();
    } else {
      setAuthChecked(true);
    }
  }, [dispatch]);

  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-key": adminKey,
        },
        body: JSON.stringify({
          refreshToken: Cookies.get("A_refreshToken"),
        }),
      });
      const data = await res.json();
      Cookies.set("A_accessToken", data.accessToken, { expires: 1 });
      Cookies.set("A_refreshToken", data.refreshToken, { expires: 1 });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          refreshToken: data.refreshToken,
          accessToken: data.accessToken,
        },
      });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  // // Refresh Token every 14 mins
  useEffect(() => {
    if (!state.user) return; // Only set up interval if user is logged in

    const interval = setInterval(() => {
      refreshToken().catch((err) => {
        console.error("Token refresh failed:", err);
      });
    }, 60 * 60 * 1000); // 14 mins

    return () => clearInterval(interval);
  }, [state.user, refreshToken]);

  return (
    <AuthContext.Provider value={{ state, loadUser, dispatch, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};
