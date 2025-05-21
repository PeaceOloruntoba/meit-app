// @/app/WalletScreen.tsx
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
import { router } from "expo-router";
import { useAuth } from "@/hook/useAuth"; // Adjust path as needed
import usePayments from "@/hook/usePayment"; // Adjust path as needed

// Assuming your firebaseConfig and toast imports are correct
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { toast } from "sonner-native";


interface BankDetails {
    accountNumber: string;
    bankCode: string;
    accountHolderName: string;
}

const WalletScreen = () => {
    const { user, updateUserBalance } = useAuth(); // Assuming useAuth has updateUserBalance
    const [balance, setBalance] = useState<number>(0);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        accountNumber: "",
        bankCode: "",
        accountHolderName: "",
    });
    const { withdrawFunds } = usePayments(); // Use withdrawFunds from usePayments
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setBalance(user.accountBalance || 0);
        }
    }, [user]);

    const handleWithdraw = async () => {
        setIsWithdrawing(true);
        setWithdrawError(null);

        if (!withdrawAmount || withdrawAmount <= 0) {
            setWithdrawError("Bitte geben Sie einen gültigen Betrag ein."); // Please enter a valid amount.
            setIsWithdrawing(false);
            return;
        }
        if (
            !bankDetails.accountNumber ||
            !bankDetails.bankCode ||
            !bankDetails.accountHolderName
        ) {
            setWithdrawError("Bitte füllen Sie alle Bankdaten aus."); // Please fill in all bank details.
            setIsWithdrawing(false);
            return;
        }

        const success = await withdrawFunds(withdrawAmount, bankDetails);
        setIsWithdrawing(false);
        if (success) {
            setIsWithdrawModalVisible(false);
            setWithdrawAmount(0);
            setBankDetails({
                accountNumber: "",
                bankCode: "",
                accountHolderName: "",
            });
        } else {
            // Error message is already set by the withdrawFunds hook
            // setWithdrawError("Auszahlung fehlgeschlagen.");
        }
    };

    return (
        <View className="flex-1 bg-background p-4 pt-20">
            <View className="flex flex-row gap-4">
                <Feather name="credit-card" size={24} />
                <Text className="text-2xl font-bold mb-4 text-textPrimary flex items-center gap-2">
                    Meine Brieftasche {/* My Wallet */}
                </Text>
            </View>
            <View className="bg-white p-4 rounded-lg shadow-md mb-6">
                <Text className="text-lg font-semibold text-textPrimary">
                    Ihr Guthaben {/* Your Balance */}
                </Text>
                <Text className="text-2xl font-bold text-green-600">
                    {balance.toFixed(2)} €
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => setIsWithdrawModalVisible(true)}
                className="bg-blue-600 text-white py-3 px-6 rounded-md w-full"
            >
                <Text className="text-lg font-semibold flex items-center gap-2">
                    Geld abheben {/* Withdraw Funds */}
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isWithdrawModalVisible}
                onRequestClose={() => setIsWithdrawModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-lg w-4/5">
                        <Text className="text-xl font-semibold mb-4">Geld abheben</Text> {/* Withdraw Funds */}
                        {withdrawError && (
                            <Text className="text-red-500 mb-4">{withdrawError}</Text>
                        )}
                        <TextInput
                            placeholder="Betrag (€)" // Amount (€)
                            keyboardType="numeric"
                            value={withdrawAmount > 0 ? withdrawAmount.toString() : ""}
                            onChangeText={(text) => setWithdrawAmount(Number(text) || 0)}
                            className="border border-gray-300 rounded-md p-2 mb-4"
                        />
                        <TextInput
                            placeholder="Kontoinhabername" // Account Holder Name
                            value={bankDetails.accountHolderName}
                            onChangeText={(text) =>
                                setBankDetails({ ...bankDetails, accountHolderName: text })
                            }
                            className="border border-gray-300 rounded-md p-2 mb-4"
                        />
                        <TextInput
                            placeholder="Kontonummer" // Account Number
                            value={bankDetails.accountNumber}
                            onChangeText={(text) =>
                                setBankDetails({ ...bankDetails, accountNumber: text })
                            }
                            className="border border-gray-300 rounded-md p-2 mb-4"
                        />
                        <TextInput
                            placeholder="Bankleitzahl (BLZ)" // Bank Code (BLZ)
                            value={bankDetails.bankCode}
                            onChangeText={(text) =>
                                setBankDetails({ ...bankDetails, bankCode: text })
                            }
                            className="border border-gray-300 rounded-md p-2 mb-4"
                        />
                        <View className="flex flex-row justify-end space-x-4">
                            <TouchableOpacity
                                onPress={() => setIsWithdrawModalVisible(false)}
                                className="bg-gray-300 py-2 px-4 rounded-md"
                                disabled={isWithdrawing}
                            >
                                <Text className="text-lg">Abbrechen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleWithdraw}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md"
                                disabled={isWithdrawing}
                            >
                                {isWithdrawing ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-lg">Bestätigen</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WalletScreen