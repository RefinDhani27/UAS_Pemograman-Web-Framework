import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCuL7MsJefYH6eE0nAeRgvHaTOTSRc88bM",
  authDomain: "book-collection-24efd.firebaseapp.com",
  projectId: "book-collection-24efd",
  storageBucket: "book-collection-24efd.appspot.com",
  messagingSenderId: "167637390023",
  appId: "1:167637390023:web:303f0acbc7807e1b83a4e2",
  measurementId: "G-MMW0VDDT3E",
  databaseURL: "https://book-collection-24efd-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };