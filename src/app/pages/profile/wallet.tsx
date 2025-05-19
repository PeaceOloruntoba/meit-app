import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/hook/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { toast } from "sonner-native";
import CryptoJS from "crypto-js";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountHolderName: string;
}

const RAPYD_API_KEY = "rak_6550D3010117173AFCAF";
const RAPYD_SECRET_KEY =
  "rsk_0b7ceb3ed3512bf7ccf2aa79af9bb50edcac83a872c9ed9ff4f5bab889c65f609be7a8940c125742";

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
      toast.error("Not authenticated.");
      return;
    }

    const amountToWithdraw = parseFloat(withdrawalAmount);

    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }

    if (amountToWithdraw > accountBalance) {
      toast.error("The withdrawal amount exceeds your balance.");
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.accountHolderName) {
      toast.error("Please provide your complete bank details.");
      return;
    }

    setIsWithdrawing(true);
    try {
      const httpMethod = "post";
      const urlPath = "/v2/payouts";
      const salt = Math.random().toString(36).substring(7);
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const requestBody = {
        amount: amountToWithdraw,
        currency: "EUR",
        beneficiary: {
          name: bankDetails.accountHolderName,
          bank_account: bankDetails.accountNumber,
          country: "DE",
        },
        ewallet: user.uid,
      };

      const dataToSign =
        httpMethod.toLowerCase() +
        urlPath +
        salt +
        timestamp +
        RAPYD_API_KEY +
        RAPYD_SECRET_KEY +
        JSON.stringify(requestBody);
      const hash = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(dataToSign));
      const signature = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(hash)
      );

      const response = await fetch("https://sandboxapi.rapyd.net/v2/payouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_key: RAPYD_API_KEY,
          signature: signature,
          timestamp: timestamp,
          salt: salt,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Payout failed: ${errorData.message || "An error occurred."}`
        );
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        accountBalance: accountBalance - amountToWithdraw,
      });
      setAccountBalance(accountBalance - amountToWithdraw);
      toast.success(
        `Withdrawal of €${amountToWithdraw.toFixed(2)} successful.`
      );
      setIsWithdrawModalVisible(false);
      setWithdrawalAmount("");
      setBankDetails({
        accountNumber: "",
        bankCode: "",
        accountHolderName: "",
      });
    } catch (error: any) {
      console.error("Error during withdrawal:", error);
      toast.error(
        `Error during withdrawal: ${
          error.message || "An unexpected error occurred."
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
          <Text className="text-lg">Account Balance</Text>
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
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
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
            <Text className="text-xl font-semibold mb-4">Withdrawal</Text>
            <TextInput
              placeholder="Withdrawal Amount"
              value={withdrawalAmount}
              onChangeText={setWithdrawalAmount}
              keyboardType="numeric"
              className="border p-2 mb-3 rounded-md"
            />
            <TextInput
              placeholder="Account Number"
              value={bankDetails.accountNumber}
              onChangeText={(text) =>
                setBankDetails({ ...bankDetails, accountNumber: text })
              }
              className="border p-2 mb-3 rounded-md"
            />
            <TextInput
              placeholder="Account Holder Name"
              value={bankDetails.accountHolderName}
              onChangeText={(text) =>
                setBankDetails({ ...bankDetails, accountHolderName: text })
              }
              className="border p-2 mb-3 rounded-md"
            />
            <View className="flex flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-300 py-2 px-4 rounded-md mr-2"
                onPress={() => setIsWithdrawModalVisible(false)}
                disabled={isWithdrawing}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-md"
                onPress={handleWithdraw}
                disabled={isWithdrawing}
              >
                <Text className="text-white">Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
