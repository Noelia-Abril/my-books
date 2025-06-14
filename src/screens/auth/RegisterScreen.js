import { Text } from '@rneui/themed';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { auth, db } from '../../config/firebase';

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
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Crear documento en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
        booksRead: 0,
        reviewsCount: 0
      });

      // 3. Mostrar alerta y redirigir
      Alert.alert(
        'Registro exitoso',
        '¡Tu cuenta ha sido creada correctamente!',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
    } catch (error) {
      let errorMessage = 'Error al registrarse';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo ya está en uso';
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
      <Text style={styles.title}>Registro</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});