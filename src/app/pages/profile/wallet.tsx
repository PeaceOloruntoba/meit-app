import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hook/useAuth";
import { usePayments } from "@/hook/usePayment";
import { toast } from "sonner-native";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountHolderName: string;
}

const WalletScreen = () => {
  const { user, updateUserBalance } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("0");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    bankCode: "DE", // You can change this default code as needed
    accountHolderName: "",
  });
  const { withdraw } = usePayments();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    if (user?.balance) {
      setBalance(user.balance);
    }
  }, [user]);

  const handleWithdraw = async () => {
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.accountHolderName) {
      toast.error("Please fill in all bank details.");
      return;
    }

    if (amountNum > balance) {
      toast.error("Insufficient balance.");
      return;
    }

    setIsWithdrawing(true);

    try {
      await withdraw({
        amount: amountNum,
        bankDetails,
        userId: "userId",
      });

      const newBalance = balance - amountNum;
      setBalance(newBalance);
      updateUserBalance(newBalance); // optional if needed globally

      toast.success("Withdrawal successful!");
      setIsWithdrawModalVisible(false);
      setWithdrawAmount("0");
      setBankDetails({
        accountNumber: "",
        bankCode: "DE",
        accountHolderName: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Withdrawal failed. Try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4 pt-20">
      <View className="flex flex-row gap-4">
        <Feather name="credit-card" size={24} />
        <Text className="text-2xl font-bold mb-4 text-textPrimary">
          My Wallet
        </Text>
      </View>

      <View className="bg-white p-4 rounded-lg shadow-md mb-6">
        <Text className="text-lg font-semibold text-textPrimary">
          Your Balance
        </Text>
        <Text className="text-2xl font-bold text-green-600">
          {balance.toFixed(2)} €
        </Text>

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
        onRequestClose={() => setIsWithdrawModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-xl font-semibold mb-4">Withdrawal</Text>

            <TextInput
              placeholder="Withdrawal Amount"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
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
                {isWithdrawing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white">Withdraw</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WalletScreen;
