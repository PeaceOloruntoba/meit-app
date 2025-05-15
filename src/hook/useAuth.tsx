import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../../firebaseConfig"; // Import your db instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile, // Alias to avoid naming conflict
  deleteUser as firebaseDeleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "sonner-native";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { Alert } from "react-native";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser({ ...authUser, ...userDocSnap.data() }); // Merge Firebase Auth user with Firestore data
        } else {
          setUser(authUser); // User exists in Firebase Auth but not yet in Firestore
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const register = async (email, password, additionalData) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      // Store additional user data in the 'users' collection
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: email,
        createdAt: new Date(),
        ...additionalData, // Include the additional data passed from the registration form
      });

      // Optionally update the user's display name in Firebase Auth
      if (additionalData?.firstName || additionalData?.lastName) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: `${additionalData.firstName || ""} ${
            additionalData.lastName || ""
          }`.trim(),
        });
      }

      // Fetch the newly created user document and update the state
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUser({ ...userCredential.user, ...userDocSnap.data() });
      } else {
        setUser(userCredential.user);
      }

      toast.success("Registrierung erfolgreich!");
    } catch (error) {
      console.error("Registrierungsfehler:", error.message);
      toast.error(`Registrierung fehlgeschlagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUser({ ...userCredential.user, ...userDocSnap.data() });
      } else {
        setUser(userCredential.user);
      }
      toast.success("Anmeldung erfolgreich!");
    } catch (error) {
      console.error("Anmeldefehler:", error.message);
      toast.error(`Anmeldung fehlgeschlagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Abmeldung erfolgreich!");
    } catch (error) {
      console.error("Abmeldefehler:", error.message);
      toast.error(`Abmeldung fehlgeschlagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the user's profile data in Firestore
  const updateProfile = async (uid, updatedData) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, updatedData, { merge: true }); // Use merge to update specific fields

      // Optionally update the user's display name in Firebase Auth if firstName or lastName is updated
      if (updatedData?.firstName || updatedData?.lastName) {
        const currentAuthUser = auth.currentUser;
        if (currentAuthUser) {
          await firebaseUpdateProfile(currentAuthUser, {
            displayName: `${updatedData.firstName || ""} ${
              updatedData.lastName || ""
            }`.trim(),
          });
        }
      }
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUser({ ...auth.currentUser, ...userDocSnap.data() });
        // toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profilaktualisierungsfehler:", error.message);
      toast.error(`Profilaktualisierung fehlgeschlagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (email, password) => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Kein Benutzer angemeldet.");
        setLoading(false);
        return false;
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      await firebaseDeleteUser(currentUser);
      setUser(null);
      toast.success("Konto erfolgreich gelöscht.");
      return true;
    } catch (error) {
      console.error("Kontolöschfehler:", error.message);
      let errorMessage = "Fehler beim Löschen des Kontos.";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Falsches Passwort.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Erfordert erneute Anmeldung. Bitte melden Sie sich erneut an und versuchen Sie es noch einmal.";
        signOut(auth);
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
