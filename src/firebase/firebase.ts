// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgki5Mj5aye6j0mcI_k9TM58hutco7uM8",
  authDomain: "ebook-platform-a618d.firebaseapp.com",
  projectId: "ebook-platform-a618d",
  storageBucket: "ebook-platform-a618d.firebasestorage.app",
  messagingSenderId: "847798671420",
  appId: "1:847798671420:web:8cd78d138abe1664740b39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports for other modules
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
