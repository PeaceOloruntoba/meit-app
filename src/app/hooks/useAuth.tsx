import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile, // Import updateProfile
} from "firebase/auth";
import { useRouter } from "expo-router";
import { toast } from "sonner-native"; // Import the hook

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>; // Removed isCompany
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateUserProfile: (displayName?: string | null) => Promise<void>; // Add updateProfile function
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
      setIsAuthenticated(!!authUser);
      setUser(authUser);
      setLoading(false);
      if (authUser) {
        router.replace("/(app)"); // Redirect to the app's main route after login
      } else {
        router.replace("/(auth)/login"); // Redirect to login if logged out
      }
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

  const register = async (email: string, password: string) => {
    // Removed isCompany
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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

  const updateUserProfile = async (displayName?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      if (auth.currentUser && displayName !== undefined) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        // Update the local user state
        setUser({ ...auth.currentUser, displayName });
        toast.success("Profil erfolgreich aktualisiert!");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Fehler beim Aktualisieren des Profils.");
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
        updateUserProfile, // Include the new function in the context
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
