import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABaBnKCFzoExLI4azVuE5BYH0qYQpR4sc",
  authDomain: "ecom-5f9b6.firebaseapp.com",
  projectId: "ecom-5f9b6",
  storageBucket: "ecom-5f9b6.firebasestorage.app",
  messagingSenderId: "1044577310524",
  appId: "1:1044577310524:web:16fa6cccf777a0dcea3039",
  measurementId: "G-G0RPH8V42E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);






