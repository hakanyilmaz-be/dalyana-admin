import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage'; // Firebase Storage importu

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDnOtMIk8cGm8lbRctZ1Ao616kz9z0Z88",
  authDomain: "dalyana-admin.firebaseapp.com",
  projectId: "dalyana-admin",
  storageBucket: "dalyana-admin.appspot.com",
  messagingSenderId: "775771408813",
  appId: "1:775771408813:web:5cd6855f47b5ccfb02f924",
  measurementId: "G-101W2QGNHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication, Firestore, and Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Firebase Storage'u başlatın
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, analytics, googleProvider };
