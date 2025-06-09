import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  authDomain: "micomidafavorita-df03a.firebaseapp.com",
  projectId: "micomidafavorita-df03a",
  storageBucket: "micomidafavorita-df03a.firebasestorage.app",
  messagingSenderId: "950939119791",
  appId: "1:950939119791:web:a41a4400d2d3767886645a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);