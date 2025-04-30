import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseConfig"; // Import db
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useRouter } from "expo-router";
import { toast } from "sonner-native";

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    additionalData: {
      lastName: string;
      firstName: string;
      address: string;
      taxId: string;
      idFrontImage: string | null;
      idBackImage: string | null;
      whatsappNumber: string;
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateUserProfile: (displayName?: string | null) => Promise<void>;
  updateAdditionalUserData: (data: {
    address?: string;
    taxId?: string;
    whatsappNumber?: string;
  }) => Promise<void>;
  additionalUserData: {
    address?: string | null;
    taxId?: string | null;
    whatsappNumber?: string | null;
  } | null;
  loadingAdditionalData: boolean;
  errorAdditionalData: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [additionalUserData, setAdditionalUserData] = useState<{
    address?: string | null;
    taxId?: string | null;
    whatsappNumber?: string | null;
  } | null>(null);
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(true);
  const [errorAdditionalData, setErrorAdditionalData] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setIsAuthenticated(!!authUser);
      setUser(authUser);
      setLoading(false);
      if (authUser) {
        await fetchAdditionalUserData(authUser.uid);
        router.replace("/(app)/my-products/index");
      } else {
        setAdditionalUserData(null);
        router.replace("/(auth)/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAdditionalUserData = async (uid: string) => {
    setLoadingAdditionalData(true);
    setErrorAdditionalData(null);
    try {
      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setAdditionalUserData(docSnap.data() as any);
      } else {
        setAdditionalUserData({}); // Initialize if no data exists yet
      }
    } catch (err: any) {
      setErrorAdditionalData(err.message);
    } finally {
      setLoadingAdditionalData(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login erfolgreich!", { duration: 6000 });
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
    additionalData: {
      lastName: string;
      firstName: string;
      address: string;
      taxId: string;
      idFrontImage: string | null;
      idBackImage: string | null;
      whatsappNumber: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        // Store all registration data in Firestore
        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, { ...additionalData });
        toast.success("Registrierung erfolgreich!");
      }
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
        await updateProfile(auth.currentUser, { displayName });
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

  const updateAdditionalUserData = async (data: {
    address?: string;
    taxId?: string;
    whatsappNumber?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, data, { merge: true }); // Use merge to update specific fields
        setAdditionalUserData({ ...additionalUserData, ...data }); // Update local state
        toast.success("Zusätzliche Daten erfolgreich aktualisiert!");
      } else {
        setError("Benutzer nicht authentifiziert.");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Fehler beim Aktualisieren der zusätzlichen Daten.");
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
        updateUserProfile,
        updateAdditionalUserData,
        additionalUserData,
        loadingAdditionalData,
        errorAdditionalData,
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
