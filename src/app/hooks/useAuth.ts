import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../utils/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null; // Replace 'any' with your user type if you have one
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = getFirestore(auth?.app); // Use optional chaining in case auth is null

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          const userDocRef = doc(db, authUser.uid);
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              setUser({ uid: authUser.uid, ...userDocSnap.data() });
              setIsAuthenticated(true);
            } else {
              setUser({ uid: authUser.uid, email: authUser.email });
              setIsAuthenticated(true);
            }
          } catch (e: any) {
            console.error("Error fetching user data:", e.message);
            setError("Failed to fetch user data.");
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      });
    } else {
      console.warn("Firebase Auth not initialized.");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [db, auth]); // Add db and auth to the dependency array

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        setError("Authentication not initialized.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    isCompany: boolean,
    additionalData: any = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (auth) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const newUser = userCredential.user;
        const userDocRef = doc(db, newUser.uid);
        const userData = {
          email: newUser.email,
          isCompany: isCompany,
          ...additionalData,
        };
        await setDoc(userDocRef, userData);
        setUser({ uid: newUser.uid, ...userData });
        setIsAuthenticated(true);
      } else {
        setError("Authentication not initialized.");
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      if (auth) {
        await signOut(auth);
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setError("Authentication not initialized.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, user, login, register, logout, loading, error }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
