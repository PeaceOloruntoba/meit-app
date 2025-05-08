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
  deleteDoc,
} from "firebase/firestore";
import { toast } from "sonner-native";
import { db } from "firebaseConfig";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  timePeriod: "Tag" | "Monat";
  deposit?: number;
  deliveryAvailable: boolean;
  deliveryCost?: number;
  additionalDeliveryCost?: number;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  contactEmail?: string;
  contactWebsite?: string;
  contactWhatsApp?: string;
  location?: string;
  userId: string; // To store the user who added the product
}

const productsCollection = collection(db, "products");

export const useProduct = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const addProduct = useCallback(
    async (productData: Omit<Product, "id" | "userId">) => {
      setLoading(true);
      setError(null);
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        toast.error("Nicht authentifiziert");
        return;
      }
      try {
        const docRef = await addDoc(productsCollection, {
          ...productData,
          userId: user.uid,
        });
        toast.success(`Produkt "${productData.name}" hinzugefügt!`);
        setLoading(false);
        return docRef.id;
      } catch (e: any) {
        setError(e.message || "Failed to add product");
        toast.error(`Fehler beim Hinzufügen des Produkts: ${e.message}`);
        setLoading(false);
        return null;
      }
    },
    [user?.uid]
  );

  const editProduct = useCallback(
    async (productId: string, productData: Partial<Product>) => {
      setLoading(true);
      setError(null);
      try {
        const productDoc = doc(db, "products", productId);
        await updateDoc(productDoc, productData);
        toast.success(`Produkt "${productData.name}" aktualisiert!`);
        setLoading(false);
        return true;
      } catch (e: any) {
        setError(e.message || "Failed to edit product");
        toast.error(`Fehler beim Aktualisieren des Produkts: ${e.message}`);
        setLoading(false);
        return false;
      }
    },
    []
  );

  const getAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(productsCollection);
      const productsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsList);
      setLoading(false);
      return productsList;
    } catch (e: any) {
      setError(e.message || "Failed to fetch products");
      toast.error(`Fehler beim Laden der Produkte: ${e.message}`);
      setLoading(false);
      return [];
    }
  }, []);

  const getSingleProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const productDoc = doc(db, "products", productId);
      const docSnap = await getDoc(productDoc);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        setLoading(false);
        return { id: docSnap.id, ...docSnap.data() } as Product;
      } else {
        setError("Product not found");
        toast.error("Produkt nicht gefunden");
        setLoading(false);
        return null;
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch product");
      toast.error(`Fehler beim Laden des Produkts: ${e.message}`);
      setLoading(false);
      return null;
    }
  }, []);

  const getUsersProducts = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(productsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        userProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(userProducts);
      setLoading(false);
      return userProducts;
    } catch (e: any) {
      setError(e.message || "Failed to fetch user's products");
      toast.error(`Fehler beim Laden deiner Produkte: ${e.message}`);
      setLoading(false);
      return [];
    }
  }, []);

  return {
    loading,
    error,
    products,
    product,
    addProduct,
    editProduct,
    getAllProducts,
    getSingleProduct,
    getUsersProducts,
  };
};
