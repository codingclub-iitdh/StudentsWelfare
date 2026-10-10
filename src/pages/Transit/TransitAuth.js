import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { requestTransitApi } from "./transitApi";

const TransitAuthContext = createContext(null);
const TRANSIT_SESSION_KEY = "transit-auth-session";

const readStoredSession = () => {
  try {
    const rawValue = sessionStorage.getItem(TRANSIT_SESSION_KEY);
    if (!rawValue) return null;
    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue?.token || !parsedValue?.user) return null;
    return parsedValue;
  } catch {
    return null;
  }
};

export const TransitAuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => readStoredSession());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState("");

  useEffect(() => {
    if (session) {
      sessionStorage.setItem(TRANSIT_SESSION_KEY, JSON.stringify(session));
      return;
    }
    sessionStorage.removeItem(TRANSIT_SESSION_KEY);
  }, [session]);

  const signIn = useCallback(async (idToken) => {
    setIsSigningIn(true);
    setSignInError("");
    try {
      const result = await requestTransitApi("/me", idToken);
      const nextSession = {
        token: idToken,
        user: result.user,
        termsVersion: result.termsVersion,
      };
      setSession(nextSession);
      return result.user;
    } catch (error) {
      setSession(null);
      setSignInError(error.message);
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    setSignInError("");
  }, []);

  const value = useMemo(() => ({
    ...session,
    isSigningIn,
    signInError,
    signIn,
    signOut,
  }), [session, isSigningIn, signInError, signIn, signOut]);

  return (
    <TransitAuthContext.Provider value={value}>
      {children}
    </TransitAuthContext.Provider>
  );
};

export const useTransitAuth = () => {
  const context = useContext(TransitAuthContext);
  if (!context) {
    throw new Error("useTransitAuth must be used inside TransitAuthProvider.");
  }
  return context;
};
