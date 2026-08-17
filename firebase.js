// firebase.js - نسخة جاهزة للـ GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 👇 حط الـ Config الحقيقي هنا
const firebaseConfig = {
  apiKey: "هتحط_الـAPI_KEY_هنا", // <-- غير ده
  authDomain: "omar-project.firebaseapp.com",
  projectId: "omar-project",
  storageBucket: "omar-project.appspot.com",
  messagingSenderId: "123456789", // <-- وده
  appId: "1:123456789:web:abcdef" // <-- وده
};
