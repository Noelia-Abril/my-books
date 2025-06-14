import { Avatar } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { auth, db, storage } from '../../config/firebase';

export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para cambiar la imagen de perfil');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });

      setImage(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      let errorMessage = 'Error al subir la imagen';
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'No tienes permiso para subir archivos';
      } else if (error.code === 'storage/canceled') {
        errorMessage = 'Subida cancelada';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar
        size="xlarge"
        rounded
        source={{ uri: image || auth.currentUser?.photoURL }}
        containerStyle={styles.avatar}
      >
        <Avatar.Accessory 
          size={30} 
          onPress={pickImage} 
          disabled={uploading}
        />
        {uploading && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator color="white" />
          </View>
        )}
      </Avatar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  avatar: {
    marginTop: 20,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
