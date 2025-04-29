import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [isCompany, setIsCompany] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState(''); // For companies
  const [idFrontImage, setIdFrontImage] = useState(''); // Placeholder for image upload
  const [idBackImage, setIdBackImage] = useState('');   // Placeholder for image upload
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agbChecked, setAgbChecked] = useState(false);
  const [datenschutzChecked, setDatenschutzChecked] = useState(false);
  const { register, loading, error } = useAuth();

  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const additionalData = isCompany
      ? { address, taxId }
      : { firstName, lastName, address };

    await register(email, password, isCompany, additionalData);

    if (!loading && !error) {
      console.log('Registration successful!');
    } else if (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      {/* Tab Switching */}
      <View className="flex-row justify-around mb-4">
        <TouchableOpacity onPress={() => setIsCompany(false)} className={`py-2 px-4 rounded-md ${!isCompany ? 'bg-gray-200' : ''}`}>
          <Text className="text-lg">{isCompany ? 'User' : 'User'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCompany(true)} className={`py-2 px-4 rounded-md ${isCompany ? 'bg-gray-200' : ''}`}>
          <Text className="text-lg">{isCompany ? 'Company' : 'Company'}</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold mb-6">Registriere dich!</Text>

      {!isCompany && (
        <>
          <View className="flex-row justify-between mb-2">
            <TextInput
              className="w-1/2 mr-2 px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Vorname"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              className="w-1/2 ml-2 px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Nachname"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </>
      )}

      <TextInput
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
        placeholder="E-Mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
        placeholder="Adresse"
        value={address}
        onChangeText={setAddress}
      />

      {isCompany && (
        <TextInput
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
          placeholder="Steuer ID / Umsatzsteuer ID"
          value={taxId}
          onChangeText={setTaxId}
        />
      )}

      <TouchableOpacity className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md justify-start">
        <Text className="text-gray-500">Bild vom Personalausweis Vorderseite</Text>
        {/* Implement image upload logic here */}
      </TouchableOpacity>

      <TouchableOpacity className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md justify-start">
        <Text className="text-gray-500">Bild vom Personalausweis Rückseite</Text>
        {/* Implement image upload logic here */}
      </TouchableOpacity>

      <TextInput
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
        placeholder="Telefonnummer - WhatsApp"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Passwort wiederholen"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Terms and Privacy Checkboxes */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity className="flex-row items-center">
          <View className={`w-5 h-5 border border-gray-400 rounded mr-2 justify-center items-center ${agbChecked ? 'bg-primary' : ''}`}>
            {agbChecked && <Text className="text-white">✓</Text>}
          </View>
          <Text>AGB</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <View className={`w-5 h-5 border border-gray-400 rounded mr-2 justify-center items-center ${datenschutzChecked ? 'bg-primary' : ''}`}>
            {datenschutzChecked && <Text className="text-white">✓</Text>}
          </View>
          <Text>Datenschutz</Text>
        </TouchableOpacity>
      </View>

      <Button
        title={loading ? 'Registrieren...' : 'Jetzt registrieren'}
        onPress={handleRegistration}
        disabled={loading || !agbChecked || !datenschutzChecked}
        color={Colors.primary}
      />

      {error && <Text className="text-red-500 mt-4">{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add more specific styles here if needed
});

export default RegisterForm;