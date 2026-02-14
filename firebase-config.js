// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDluJn6c-9vr3jJUEIl3FJ2l4HD4W1M2k",
  authDomain: "gradewise-app.firebaseapp.com",
  projectId: "gradewise-app",
  storageBucket: "gradewise-app.firebasestorage.app",
  messagingSenderId: "938150156100",
  appId: "1:938150156100:web:219cfacbf0452ddfe2e911"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export for use in other files
window.cloud = { db, auth, storage };
console.log("🔥 Firebase Connected");