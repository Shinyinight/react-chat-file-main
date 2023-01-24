import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "chat-25704.firebaseapp.com",
  databaseURL: "https://chat-25704.firebaseio.com",
  projectId: "chat-25704",
  storageBucket: "chat-25704.appspot.com",
  messagingSenderId: "1056680930050",
  appId: process.env.REACT_APP_ID,
  measurementId: "G-HTRGZTD10B",
};

// const firebaseApp = firebase.initializeApp(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();

const db = getFirestore(app);
export default db;
