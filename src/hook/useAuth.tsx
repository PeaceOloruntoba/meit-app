import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
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
import axios from "axios";

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

  // This function is less critical now as the webhook updates Firestore,
  // and the main user object is refreshed from Firestore.
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
        payoutsEnabled: false, // Initialize payout status
        chargesEnabled: false, // Initialize charges status
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
        }
      );

      if (response.status === 200 && response.data.url) {
        const { url } = response.data;
        // Open the Stripe onboarding URL in a web browser
        const result = await WebBrowser.openBrowserAsync(url);

        // After the browser is closed (either by user or redirect),
        // re-fetch the user's data from Firestore. The backend webhook
        // (account.updated) should have updated the stripeAccountId and
        // payoutsEnabled status in Firestore by this point.
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser((prevUser) => ({ ...prevUser, ...userDocSnap.data() }));
        }

        // Provide user feedback based on browser result type, but actual Stripe status
        // is best confirmed by the Firestore data (updated by webhook).
        if (result.type === WebBrowser.WebBrowserResultType.CANCEL) {
          toast.info("Stripe-Verbindung abgebrochen.");
        } else if (result.type === WebBrowser.WebBrowserResultType.DISMISS) {
          // This often means the user completed the flow or closed the browser.
          // The Firestore re-fetch above will confirm the status.
          // Check if stripeAccountId is now present or payoutsEnabled is true
          if (userDocSnap.exists() && userDocSnap.data()?.payoutsEnabled) {
            toast.success("Stripe-Konto erfolgreich verbunden!");
          } else {
            toast.info(
              "Stripe-Verbindung abgeschlossen, Status wird aktualisiert."
            );
          }
        } else if (result.type === WebBrowser.WebBrowserResultType.LOCKED) {
          toast.error("Stripe-Verbindung fehlgeschlagen.");
        }
      } else {
        toast.error("Fehler beim Erstellen des Stripe-Verbindungslinks.");
      }
    } catch (error: any) {
      console.error("Fehler beim Verbinden des Stripe-Kontos:", error);
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
        updateStripeAccountId, // Expose this (though less critical now)
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
