import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner-native";
import { db } from "firebaseConfig";

export interface Rental {
  id?: string;
  userId: string;
  productId: string;
  ownerId: string;
  price: number;
  paymentStatus: "paid" | "unpaid";
  rentalStatus: "pending" | "cancelled" | "success" | "ongoing";
  createdAt: FieldValue;
}

const rentalsCollection = collection(db, "rentals");

export const useRental = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rental, setRental] = useState<Rental | null>(null);

  const createRental = useCallback(
    async (productId: string, ownerId: string, price: number) => {
      setLoading(true);
      setError(null);
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        toast.error("Nicht authentifiziert");
        return null;
      }
      try {
        const docRef = await addDoc(rentalsCollection, {
          userId: user.uid,
          productId,
          ownerId,
          price,
          paymentStatus: "unpaid",
          rentalStatus: "pending",
          createdAt: serverTimestamp(),
        });
        toast.success("Anfrage zum Mieten gesendet!");
        setLoading(false);
        return docRef.id;
      } catch (e: any) {
        console.log(e)
        setError(e.message || "Failed to create rental");
        toast.error(`Fehler beim Senden der Mietanfrage: ${e.message}`);
        setLoading(false);
        return null;
      }
    },
    [user?.uid]
  );

  const updateRentalPaymentStatus = useCallback(
    async (rentalId: string, paymentStatus: "paid" | "unpaid") => {
      setLoading(true);
      setError(null);
      try {
        const rentalDoc = doc(db, "rentals", rentalId);
        await updateDoc(rentalDoc, { paymentStatus });
        toast.success(`Zahlungsstatus aktualisiert zu: ${paymentStatus}`);
        setLoading(false);
        return true;
      } catch (e: any) {
        setError(e.message || "Failed to update payment status");
        toast.error(
          `Fehler beim Aktualisieren des Zahlungsstatus: ${e.message}`
        );
        setLoading(false);
        return false;
      }
    },
    []
  );

  const updateRentalStatus = useCallback(
    async (
      rentalId: string,
      rentalStatus: "pending" | "cancelled" | "success" | "ongoing"
    ) => {
      setLoading(true);
      setError(null);
      try {
        const rentalDoc = doc(db, "rentals", rentalId);
        await updateDoc(rentalDoc, { rentalStatus });
        toast.success(`Mietstatus aktualisiert zu: ${rentalStatus}`);
        setLoading(false);
        return true;
      } catch (e: any) {
        setError(e.message || "Failed to update rental status");
        toast.error(`Fehler beim Aktualisieren des Mietstatus: ${e.message}`);
        setLoading(false);
        return false;
      }
    },
    []
  );

  const getRentalsByUserId = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(rentalsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userRentals: Rental[] = [];
      querySnapshot.forEach((doc) => {
        userRentals.push({ id: doc.id, ...doc.data() } as Rental);
      });
      setRentals(userRentals);
      setLoading(false);
      return userRentals;
    } catch (e: any) {
      setError(e.message || "Failed to fetch user's rentals");
      toast.error(`Fehler beim Laden deiner Mietvorgänge: ${e.message}`);
      setLoading(false);
      return [];
    }
  }, []);

  const getRentalsByOwnerId = useCallback(async (ownerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(rentalsCollection, where("ownerId", "==", ownerId));
      const querySnapshot = await getDocs(q);
      const ownerRentals: Rental[] = [];
      querySnapshot.forEach((doc) => {
        ownerRentals.push({ id: doc.id, ...doc.data() } as Rental);
      });
      setRentals(ownerRentals);
      setLoading(false);
      return ownerRentals;
    } catch (e: any) {
      setError(e.message || "Failed to fetch rentals for your products");
      toast.error(
        `Fehler beim Laden der Mietvorgänge deiner Produkte: ${e.message}`
      );
      setLoading(false);
      return [];
    }
  }, []);

  const getRentalById = useCallback(async (rentalId: string) => {
    setLoading(true);
    setError(null);
    try {
      const rentalDoc = doc(db, "rentals", rentalId);
      const docSnap = await getDoc(rentalDoc);
      if (docSnap.exists()) {
        setRental({ id: docSnap.id, ...docSnap.data() } as Rental);
        setLoading(false);
        return { id: docSnap.id, ...docSnap.data() } as Rental;
      } else {
        setError("Rental not found");
        toast.error("Mietvorgang nicht gefunden");
        setLoading(false);
        return null;
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch rental");
      toast.error(`Fehler beim Laden des Mietvorgangs: ${e.message}`);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    rentals,
    rental,
    createRental,
    updateRentalPaymentStatus,
    updateRentalStatus,
    getRentalsByUserId,
    getRentalsByOwnerId,
    getRentalById,
  };
};
