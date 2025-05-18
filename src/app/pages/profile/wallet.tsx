import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/hook/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { toast } from "sonner-native";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountHolderName: string;
}

export default function WalletScreen() {
  const { user } = useAuth();
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    bankCode: "",
    accountHolderName: "",
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setAccountBalance(docSnap.data()?.accountBalance || 0);
        }
      }
    };

    fetchBalance();
  }, [user?.uid]);

  const handleWithdraw = async () => {
    if (!user?.uid) {
      toast.error("Nicht authentifiziert.");
      return;
    }

    const amountToWithdraw = parseFloat(withdrawalAmount);

    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      toast.error("Bitte gib einen gültigen Auszahlungsbetrag ein.");
      return;
    }

    if (amountToWithdraw > accountBalance) {
      toast.error("Der Auszahlungsbetrag übersteigt dein Guthaben.");
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.accountHolderName) {
      toast.error("Bitte gib deine Bankdaten vollständig an.");
      return;
    }

    setIsWithdrawing(true);
    try {
      // Hier rufst du deinen Backend-Endpunkt auf, der die Rapyd-Auszahlung veranlasst.
      const response = await fetch("/api/rapyd-payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountToWithdraw,
          currency: "EUR", // Hardcoded für Deutschland, anpassen falls nötig
          beneficiary: {
            name: bankDetails.accountHolderName,
            bank_account: bankDetails.accountNumber,
            // bank_code: bankDetails.bankCode, // Füge Bankleitzahl/IBAN/SWIFT je nach Bedarf hinzu
            country: "DE", // Hardcoded für Deutschland, anpassen falls nötig
            // Weitere Details je nach Rapyd Payout API
          },
          ewallet: user.uid, // Optional: Wenn du Rapyd eWallets verwendest
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Auszahlung fehlgeschlagen: ${
            errorData.message || "Ein Fehler ist aufgetreten."
          }`
        );
        return;
      }

      // Auszahlung erfolgreich, aktualisiere den Kontostand in Firebase
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        accountBalance: accountBalance - amountToWithdraw,
      });
      setAccountBalance(accountBalance - amountToWithdraw);
      toast.success(
        `Auszahlung von €${amountToWithdraw.toFixed(2)} erfolgreich.`
      );
      setIsWithdrawModalVisible(false);
      setWithdrawalAmount("");
      setBankDetails({
        accountNumber: "",
        bankCode: "",
        accountHolderName: "",
      });
    } catch (error: any) {
      console.error("Fehler bei der Auszahlung:", error);
      toast.error(
        `Fehler bei der Auszahlung: ${
          error.message || "Ein unerwarteter Fehler ist aufgetreten."
        }`
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F2F5FA] p-4 flex-col justify-between pt-20">
      <View>
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold mb-2">
          Wallet{" "}
          <Text className="text-xl font-semibold mb-4">Miet Payments</Text>
        </Text>
        <View className="flex flex-row items-center justify-between mt-6">
          <Text className="text-lg">Kontostand</Text>
          <Text className="text-5xl font-semibold">
            € {accountBalance.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsWithdrawModalVisible(true)}
          className="bg-blue-600 m-4 p-4 rounded-lg flex items-center"
          disabled={isWithdrawing}
        >
          <Text className="text-white font-semibold text-xl uppercase">
            {isWithdrawing ? "Auszahlung läuft..." : "Auszahlen"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isWithdrawModalVisible}
        onRequestClose={() => {
          setIsWithdrawModalVisible(!isWithdrawModalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-xl font-semibold mb-4">Auszahlung</Text>
            <TextInput
              placeholder="Auszahlungsbetrag"
              value={withdrawalAmount}
              onChangeText={setWithdrawalAmount}
              keyboardType="numeric"
              className="border p-2 mb-3 rounded-md"
            />
            <TextInput
              placeholder="Kontonummer"
              value={bankDetails.accountNumber}
              onChangeText={(text) =>
                setBankDetails({ ...bankDetails, accountNumber: text })
              }
              className="border p-2 mb-3 rounded-md"
            />
            <TextInput
              placeholder="Name des Kontoinhabers"
              value={bankDetails.accountHolderName}
              onChangeText={(text) =>
                setBankDetails({ ...bankDetails, accountHolderName: text })
              }
              className="border p-2 mb-3 rounded-md"
            />
            {/* Optional: Feld für Bankleitzahl/IBAN/SWIFT */}
            <View className="flex flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-300 py-2 px-4 rounded-md mr-2"
                onPress={() => setIsWithdrawModalVisible(false)}
                disabled={isWithdrawing}
              >
                <Text>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-md"
                onPress={handleWithdraw}
                disabled={isWithdrawing}
              >
                <Text className="text-white">Auszahlen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
