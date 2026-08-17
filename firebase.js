// firebase.js - المخ بتاع التلات صفحات
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "هتحط_الـAPI_KEY_هنا",
  authDomain: "omar-project.firebaseapp.com",
  projectId: "omar-project",
  storageBucket: "omar-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// دوال عامة عشان نستخدمها في التلات صفحات
export async function saveData(colName, id, data){
  await setDoc(doc(db, colName, id), data);
}
export async function deleteData(colName, id){
  await deleteDoc(doc(db, colName, id));
}
export function listenData(colName, callback){
  onSnapshot(collection(db, colName), (snap)=>{
    let arr = [];
    snap.forEach(d=> arr.push({id: d.id, ...d.data()}));
    callback(arr);
  });
}
