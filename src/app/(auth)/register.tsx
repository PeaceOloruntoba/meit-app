import React from "react";
import { View } from "react-native";
import RegisterForm from "../components/Auth/RegisterForm";

const RegisterPage = () => {
  return (
    <View className="flex-1 bg-background">
      <RegisterForm />
    </View>
  );
};

export default RegisterPage;
