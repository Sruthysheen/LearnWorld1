// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC0Dk65h5EEbeTbrmYioDAXG5ixgCQXyAQ",
  authDomain: "learnworld-b2c69.firebaseapp.com",
  projectId: "learnworld-b2c69",
  storageBucket: "learnworld-b2c69.appspot.com",
  messagingSenderId: "808457926235",
  appId: "1:808457926235:web:8fe469e3bd05a51c6eb17e",
  measurementId: "G-BBF7VKFFE7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

