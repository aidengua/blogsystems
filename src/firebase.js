import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAZQbbqqCLhgKvonleLzI-r6PQijuGBC5w",
    authDomain: "blogsystem-2d313.firebaseapp.com",
    projectId: "blogsystem-2d313",
    storageBucket: "blogsystem-2d313.firebasestorage.app",
    messagingSenderId: "521340042994",
    appId: "1:521340042994:web:935cd5b82a8b9e4ef25a6b",
    measurementId: "G-GQ295WR3WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
