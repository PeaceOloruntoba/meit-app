import React from "react";
import { View } from "react-native";
import LoginForm from "../../components/Auth/LoginForm";

const LoginPage = () => {
  return (
    <View className="flex-1 bg-background">
      <LoginForm />
    </View>
  );
};

export default LoginPage;
