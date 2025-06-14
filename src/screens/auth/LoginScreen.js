import { Button, Input } from '@rneui/themed';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
        booksRead: 0,
        reviewsCount: 0
      });

      Alert.alert(
        'Registro exitoso',
        '¡Tu cuenta ha sido creada correctamente!',
        [
          { 
            text: 'Ir a Login', 
            onPress: () => navigation.replace('Login') 
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'Error al registrarse';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Registro</Text>
      
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={{ type: 'material-community', name: 'email-outline' }}
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
      
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextEntry}
        leftIcon={{ type: 'material-community', name: 'lock-outline' }}
        rightIcon={{
          type: 'material-community',
          name: secureTextEntry ? 'eye-off-outline' : 'eye-outline',
          onPress: () => setSecureTextEntry(!secureTextEntry),
        }}
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
      
      <Input
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={confirmSecureTextEntry}
        leftIcon={{ type: 'material-community', name: 'lock-check-outline' }}
        rightIcon={{
          type: 'material-community',
          name: confirmSecureTextEntry ? 'eye-off-outline' : 'eye-outline',
          onPress: () => setConfirmSecureTextEntry(!confirmSecureTextEntry),
        }}
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
      
      <Button
        title="Registrarse"
        onPress={handleRegister}
        loading={loading}
        buttonStyle={styles.registerButton}
        containerStyle={styles.buttonContainer}
        disabled={!email || !password || !confirmPassword}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputText: {
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Verde para acción de registro
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: '#2089dc',
    fontSize: 16,
    fontWeight: 'bold',
  },
});