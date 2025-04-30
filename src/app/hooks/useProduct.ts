import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  Firestore,
} from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig"; // Assuming you have your Firebase config here
import { useAuth } from "./useAuth";
import { toast } from "sonner-native";

interface Product {
  id: string;
  name: string; // You'll need a field for the product name
  description?: string;
  imageUrl?: string[]; // Allow multiple images
  price?: number; // General price, might be linked to Zeitraum
  pricePerDay?: number; // Specific price per day
  pricePerMonth?: number; // Specific price per month (if applicable)
  deposit?: number;
  deliveryAvailable?: boolean; // For the "Zustellung" option
  deliveryCost?: number;
  // The second "Lieferpreis" field is unclear, let's assume it's another delivery option cost or a price range.
  // You might need to clarify its purpose. For now, I'll add a generic 'additionalDeliveryCost'.
  additionalDeliveryCost?: number;
  startDate?: string; // For rental periods
  endDate?: string; // For rental periods
  contactEmail?: string;
  contactWebsite?: string;
  contactWhatsApp?: string;
  location?: string;
  userId: string;
  // Add other relevant fields captured in the "Add Product" screen
}

interface UseProductHook {
  loading: boolean;
  error: string | null;
  products: Product[];
  product: Product | null;
  addProduct: (
    productData: Omit<Product, "id" | "userId">
  ) => Promise<string | null>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProduct: (
    productId: string,
    productData: Partial<Product>
  ) => Promise<void>;
  getAllProducts: () => Promise<Product[]>;
  getProduct: (productId: string) => Promise<Product | null>;
  getUserProducts: () => Promise<Product[]>;
}

const useProduct = (): UseProductHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const productsCollectionRef = collection(db, "products");

  const addProduct = async (
    productData: Omit<Product, "id" | "userId">
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    if (!user?.uid) {
      setError("User not authenticated.");
      setLoading(false);
      return null;
    }
    try {
      const docRef = await addDoc(productsCollectionRef, {
        ...productData,
        userId: user.uid,
      });
      toast.success("Produkt erfolgreich hinzugefügt!");
      setLoading(false);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      toast.error("Fehler beim Hinzufügen des Produkts.");
      setLoading(false);
      return null;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const productDocRef = doc(db, "products", productId);
      await deleteDoc(productDocRef);
      toast.success("Produkt erfolgreich gelöscht!");
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      toast.error("Fehler beim Löschen des Produkts.");
      setLoading(false);
    }
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Product>
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const productDocRef = doc(db, "products", productId);
      await updateDoc(productDocRef, productData);
      toast.success("Produkt erfolgreich aktualisiert!");
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      toast.error("Fehler beim Aktualisieren des Produkts.");
      setLoading(false);
    }
  };

  const getAllProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(productsCollectionRef);
      const productList: Product[] = [];
      querySnapshot.forEach((doc) => {
        productList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productList);
      setLoading(false);
      return productList;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return [];
    }
  };

  const getProduct = async (productId: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const productDocRef = doc(db, "products", productId);
      const docSnap = await getDoc(productDocRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        setLoading(false);
        return { id: docSnap.id, ...docSnap.data() } as Product;
      } else {
        setProduct(null);
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const getUserProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    if (!user?.uid) {
      setError("User not authenticated.");
      setLoading(false);
      return [];
    }
    try {
      const q = query(productsCollectionRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userProductsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        userProductsList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(userProductsList);
      setLoading(false);
      return userProductsList;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return [];
    }
  };

  return {
    loading,
    error,
    products,
    product,
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getProduct,
    getUserProducts,
  };
};

export default useProduct;
