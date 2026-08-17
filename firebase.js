// firebase.js - المخ بتاع التلات صفحات - نسخة جاهزة للـ GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 👇👇👇 حط الـ Config الحقيقي بتاعك هنا من Firebase Console
// Firebase Console > Project Settings > General > Your apps > SDK setup and configuration > Config
const firebaseConfig = {
  apiKey: "هتحط_الـAPI_KEY_هنا",
  authDomain: "omar-project.firebaseapp.com",
  projectId: "omar-project",
  storageBucket: "omar-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let app, db;
let isFirebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // عشان يشتغل Offline كمان
  enableIndexedDbPersistence(db).catch(() => {});
  isFirebaseReady = true;
  console.log("✅ Firebase connected:", firebaseConfig.projectId);
} catch (e) {
  console.warn("⚠️ Firebase مش شغال - هيشتغل Local فقط:", e.message);
}

// دوال عامة عشان نستخدمها في التلات صفحات
export async function saveData(colName, id, data){
  // دايما احفظ Local
  try {
    let local = JSON.parse(localStorage.getItem(colName) || '{}');
    if (Array.isArray(local)) {
      // لو Array زي omar_tx_v3
      let arr = JSON.parse(localStorage.getItem(colName) || '[]');
      let idx = arr.findIndex(x => x.id === id);
      if (idx >= 0) arr[idx] = {id, ...data};
      else arr.push({id, ...data});
      localStorage.setItem(colName, JSON.stringify(arr));
    }
  } catch(e) {}

  // وحاول تحفظ في Firebase لو شغال
  if (!isFirebaseReady) return;
  try {
    await setDoc(doc(db, colName, id), data);
  } catch(e) {
    console.warn("Firebase save failed:", e.message);
  }
}

export async function deleteData(colName, id){
  // امسح Local
  try {
    let arr = JSON.parse(localStorage.getItem(colName) || '[]');
    if (Array.isArray(arr)) {
      arr = arr.filter(x => x.id !== id);
      localStorage.setItem(colName, JSON.stringify(arr));
    }
  } catch(e) {}

  if (!isFirebaseReady) return;
  try {
    await deleteDoc(doc(db, colName, id));
  } catch(e) {
    console.warn("Firebase delete failed:", e.message);
  }
}

export function listenData(colName, callback){
  // أول مرة رجع الـ Local بسرعة
  try {
    let local = JSON.parse(localStorage.getItem(colName) || 'null');
    if (local) {
      if (Array.isArray(local)) callback(local);
      else {
        let arr = Object.values(local);
        if (arr.length) callback(arr);
      }
    }
  } catch(e) {}

  if (!isFirebaseReady) {
    console.log("📱 شغال Local فقط - Firebase مش متوصل");
    return () => {};
  }

  // وبعدين اسمع Firebase Live
  return onSnapshot(collection(db, colName), (snap)=>{
    let arr = [];
    snap.forEach(d=> arr.push({id: d.id, ...d.data()}));
    // حدث الـ Local كمان
    try {
      localStorage.setItem(colName, JSON.stringify(arr));
    } catch(e) {}
    callback(arr);
  }, (err) => {
    console.warn("Firebase listen failed, شغال Local:", err.message);
  });
}

export function isFirebaseConnected() {
  return isFirebaseReady;
}
