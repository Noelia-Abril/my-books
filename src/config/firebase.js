import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDY9zDFc0R5uHQJJGVtrMMskguUQ_j3w-o",
  authDomain: "micomidafavorita-df03a.firebaseapp.com",
  projectId: "micomidafavorita-df03a",
  storageBucket: "micomidafavorita-df03a.firebasestorage.app",
  messagingSenderId: "950939119791",
  appId: "1:950939119791:web:a41a4400d2d3767886645a",
  measurementId: "G-M14BCLMY3X",
};
const app = initializeApp(firebaseConfig);

// Configura auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
