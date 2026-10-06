import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { requestTransitApi } from "./transitApi";

const TransitAuthContext = createContext(null);

export const TransitAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState("");

  const signIn = useCallback(async (idToken) => {
    setIsSigningIn(true);
    setSignInError("");
    try {
      const result = await requestTransitApi("/me", idToken);
      setSession({
        token: idToken,
        user: result.user,
        termsVersion: result.termsVersion,
      });
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
