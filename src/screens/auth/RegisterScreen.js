import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Registro</Text>
      <Input 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input 
        placeholder="Contraseña" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />
      <Input 
        placeholder="Confirmar Contraseña" 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry 
      />
      <Button 
        title="Registrarse" 
        containerStyle={styles.button}
        onPress={handleRegister}
        loading={loading}
      />
      <Button 
        title="¿Ya tienes cuenta? Inicia sesión" 
        type="clear"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}