import { useState, useCallback } from "react";
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
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useAuth } from "./useAuth";
import { toast } from "sonner-native";

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrls?: string[];
  price?: number;
  pricePerDay?: number;
  pricePerMonth?: number;
  deposit?: number;
  deliveryAvailable?: boolean;
  deliveryCost?: number;
  additionalDeliveryCost?: number;
  startDate?: string;
  endDate?: string;
  contactEmail?: string;
  contactWebsite?: string;
  contactWhatsApp?: string;
  location?: string;
  userId: string;
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

  const handleAsync = useCallback(
    async <T>(
      callback: () => Promise<T>,
      onSuccessMessage?: string
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await callback();
        if (onSuccessMessage) toast.success(onSuccessMessage);
        return result;
      } catch (err: any) {
        const message = err.message || "Ein Fehler ist aufgetreten.";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addProduct = useCallback(
    async (
      productData: Omit<Product, "id" | "userId">
    ): Promise<string | null> => {
      if (!user?.uid) {
        setError("User not authenticated.");
        return null;
      }
      return await handleAsync(async () => {
        const docRef = await addDoc(productsCollectionRef, {
          ...productData,
          userId: user.uid,
        });
        return docRef.id;
      }, "Produkt erfolgreich hinzugefügt!");
    },
    [user?.uid, handleAsync]
  );

  const deleteProduct = useCallback(
    async (productId: string): Promise<void> => {
      await handleAsync(async () => {
        const productDocRef = doc(db, "products", productId);
        await deleteDoc(productDocRef);
      }, "Produkt erfolgreich gelöscht!");
    },
    [handleAsync]
  );

  const updateProduct = useCallback(
    async (productId: string, productData: Partial<Product>): Promise<void> => {
      await handleAsync(async () => {
        const productDocRef = doc(db, "products", productId);
        await updateDoc(productDocRef, productData);
      }, "Produkt erfolgreich aktualisiert!");
    },
    [handleAsync]
  );

  const getAllProducts = useCallback(async (): Promise<Product[]> => {
    const result = await handleAsync(async () => {
      const snapshot = await getDocs(productsCollectionRef);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      );
    });

    if (result) setProducts(result);
    return result || [];
  }, [handleAsync, productsCollectionRef]);

  const getProduct = useCallback(
    async (productId: string): Promise<Product | null> => {
      const result = await handleAsync(async () => {
        const productDocRef = doc(db, "products", productId);
        const docSnap = await getDoc(productDocRef);
        return docSnap.exists()
          ? ({ id: docSnap.id, ...docSnap.data() } as Product)
          : null;
      });

      setProduct(result);
      return result;
    },
    [handleAsync]
  );

  const getUserProducts = useCallback(async (): Promise<Product[]> => {
    if (!user?.uid) {
      setError("User not authenticated.");
      return [];
    }

    const result = await handleAsync(async () => {
      const q = query(productsCollectionRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      );
    });

    if (result) setProducts(result);
    return result || [];
  }, [user?.uid, handleAsync, productsCollectionRef]);

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
