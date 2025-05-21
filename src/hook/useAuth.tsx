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
import * as WebBrowser from "expo-web-browser"; // For opening web links

const AuthContext = createContext(null);

// IMPORTANT: Use your actual Render.com backend base URL
const RENDER_BACKEND_URL = "https://silver-train-c0k5.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update the user object in context
  const updateUserBalance = useCallback((newBalance: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, accountBalance: newBalance };
    });
  }, []);

  const updateStripeAccountId = useCallback((newStripeAccountId: string) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, stripeAccountId: newStripeAccountId };
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          // Merge Firebase Auth user with Firestore data, including stripeAccountId
          setUser({ ...authUser, ...userDocSnap.data() });
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
        accountBalance: 0, // Initialize balance for new users
        stripeAccountId: null, // Initialize stripeAccountId as null
        ...additionalData,
      });

      if (additionalData?.firstName || additionalData?.lastName) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: `${additionalData.firstName || ""} ${
            additionalData.lastName || ""
          }`.trim(),
        });
      }

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

  const updateProfile = async (uid, updatedData) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, updatedData, { merge: true });

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

  // New function to initiate Stripe Connect onboarding
  const connectStripeAccount = async () => {
    if (!user?.uid) {
      toast.error(
        "Bitte melden Sie sich an, um Ihr Stripe-Konto zu verbinden."
      );
      return;
    }
    try {
      // Call your backend to create an account link
      const response = await axios.post(
        `${RENDER_BACKEND_URL}/api/miet-app/payments/create-account-link`,
        {
          userId: user.uid,
          // The return_url and refresh_url will be handled by your backend.
          // Ensure your backend's return_url points to a deep link in your app
          // or a web page that then redirects to a deep link.
        }
      );

      if (response.status === 200 && response.data.url) {
        const { url } = response.data;
        // Open the Stripe onboarding URL in a web browser
        const result = await WebBrowser.openBrowserAsync(url);

        // After the user completes the flow and is redirected back,
        // you'll need a mechanism to update the user's stripeAccountId in Firebase.
        // This is typically done via a backend webhook (account.updated event)
        // or by checking the user's Stripe account status on return.
        // For immediate feedback, you could re-fetch user data:
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser((prevUser) => ({ ...prevUser, ...userDocSnap.data() }));
        }

        if (result.type === "cancel") {
          toast.info("Stripe-Verbindung abgebrochen.");
        } else if (result.type === "success") {
          // The actual stripeAccountId update should ideally come from a webhook
          // or a dedicated backend endpoint that confirms the account is ready.
          // For now, we'll rely on the re-fetch above.
          toast.success(
            "Stripe-Verbindung möglicherweise erfolgreich. Überprüfen Sie Ihr Profil."
          );
        }
      } else {
        toast.error("Fehler beim Erstellen des Stripe-Verbindungslinks.");
      }
    } catch (error: any) {
      console.error("Fehler beim Verbinden des Stripe-Kontos:", error.message);
      toast.error(`Fehler beim Verbinden des Stripe-Kontos: ${error.message}`);
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
        updateUserBalance, // Expose this for usePayments
        updateStripeAccountId, // Expose this
        connectStripeAccount, // Expose this
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
