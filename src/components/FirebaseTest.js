import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function FirebaseTest() {
  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('Current user:', auth.currentUser);
        
        const docRef = await addDoc(collection(db, "test"), {
          test: "Firestore connection works!",
          timestamp: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        
      } catch (e) {
        console.error("Error testing Firebase:", e);
      }
    };
    
    testFirebase();
  }, []);

  return (
    <View>
      <Text>Verificando conexión con Firebase...</Text>
    </View>
  );
}