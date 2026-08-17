// firebase.js - المخ بتاع التلات صفحات - نسخة نهائية سامعة Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Config الحقيقي بتاع Omar - omar-project-32c66
const firebaseConfig = {
  apiKey: "AIzaSyBfY2u5XCwowJ2_kiOZoH8n52RgwoSLuog",
  authDomain: "omar-project-32c66.firebaseapp.com",
  projectId: "omar-project-32c66",
  storageBucket: "omar-project-32c66.firebasestorage.app",
  messagingSenderId: "565578222991",
  appId: "1:565578222991:web:19231bf26995849d874ffa",
  measurementId: "G-9DWP9EZHRF"
};

let app, db;
let isFirebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  enableIndexedDbPersistence(db).catch(() => {});
  isFirebaseReady = true;
  console.log("✅ Firebase connected:", firebaseConfig.projectId);
} catch (e) {
  console.warn("⚠️ Firebase مش شغال - هيشتغل Local فقط:", e.message);
}

export async function saveData(colName, id, data){
  if (!isFirebaseReady) {
    console.warn("Firebase not ready, saving local only");
    return;
  }
  try {
    await setDoc(doc(db, colName, id), data);
  } catch(e) {
    console.warn("Firebase save failed:", e.message);
  }
}

export async function deleteData(colName, id){
  if (!isFirebaseReady) return;
  try {
    await deleteDoc(doc(db, colName, id));
  } catch(e) {
    console.warn("Firebase delete failed:", e.message);
  }
}

export function listenData(colName, callback){
  if (!isFirebaseReady) {
    console.log("📱 شغال Local فقط - Firebase مش متوصل");
    return () => {};
  }
  return onSnapshot(collection(db, colName), (snap)=>{
    let arr = [];
    snap.forEach(d=> arr.push({id: d.id, ...d.data()}));
    callback(arr);
  }, (err) => {
    console.warn("Firebase listen failed:", err.message);
  });
}

export function isFirebaseConnected() {
  return isFirebaseReady;
}
