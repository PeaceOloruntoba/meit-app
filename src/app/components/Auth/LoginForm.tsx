import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'expo-router';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
    if (!loading && !error) {
      console.log('Login successful!');
    } else if (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-3xl font-bold mb-8">Login</Text>
      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="E-Mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md"
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={loading ? 'Einloggen...' : 'Einloggen'}
        onPress={handleLogin}
        disabled={loading}
        color={Colors.primary}
      />
      {error && <Text className="text-red-500 mt-4">{error}</Text>}
      <View className="mt-6">
        <Text className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/(auth)/register" className="text-primary font-semibold">
            Register
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default LoginForm;