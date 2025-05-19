import { View, Text, TouchableOpacity, Modal, TextInput, GestureResponderEvent } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/hook/useAuth";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountHolderName: string;
}


export default function WalletScreen() {

  function setIsWithdrawModalVisible(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  function setWithdrawalAmount(text: string): void {
    throw new Error("Function not implemented.");
  }

  function setBankDetails(arg0: any): void {
    throw new Error("Function not implemented.");
  }

  function handleWithdraw(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

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
            €0.00
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
