import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { useRouter } from "expo-router";
import { toast } from "sonner-native"; // Import the hook

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    isCompany: boolean,
    additionalData?: any
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setIsAuthenticated(true);
        setUser(authUser);
        // Simulate role check - in a real app, fetch this from Firestore or auth metadata
        const userRole = authUser.email?.includes("company")
          ? "company"
          : "user";

        if (userRole === "company") {
          router.replace("/(app)/companies");
        } else {
          router.replace("/(app)/users");
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]); // Add router to the dependency array

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login erfolgreich!", {
        duration: 6000,
      });
      // Navigation is handled in the onAuthStateChanged listener
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Benutzer mit dieser E-Mail wurde nicht gefunden.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Falsches Passwort.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    isCompany: boolean,
    additionalData?: any
  ) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      const role = isCompany ? "company" : "user";
      console.log(
        "Registration successful for:",
        newUser.email,
        "Role:",
        role,
        additionalData
      );
      toast.success("Registrierung erfolgreich!");
      // Navigation will be handled by the auth state listener
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
