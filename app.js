// نظام Omar - مربوط بـ Firebase + Google Sheets - نسخة نهائية
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzh_9Ob76032uBa-0WqRopMVvZ5nEfwiJ7cE9wSQ8JItDnmGezp40OC23L0oDwlHJetjg/exec";

// --- Firebase Config ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFY2u5XCwowJ2_kiOZoH8n52RgwoSLuog",
  authDomain: "omar-project-32c66.firebaseapp.com",
  projectId: "omar-project-32c66",
  storageBucket: "omar-project-32c66.firebasestorage.app",
  messagingSenderId: "565578222991",
  appId: "1:565578222991:web:19231bf26995849d874ffa",
  measurementId: "G-9DWP9EZHRF"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase متصل في app.js");
} catch(e){ console.log("Firebase already init"); }

async function saveToFirebase(colName, data){
  if(!db) return;
  try {
    await addDoc(collection(db, colName), { ...data, createdAt: serverTimestamp(), owner:"omar", localTime: new Date().toISOString() });
    console.log("✅ Firebase Saved:", colName, data);
  } catch(err){ console.error("Firebase Error", err); }
}

async function sendToOmarSheet(tabName, rowArray) {
  try {
    fetch(SHEET_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab: tabName, values: rowArray })
    });
    console.log("✅ تم الارسال لـ " + tabName + ":", rowArray);
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:12px;z-index:9999;background:#10b981;color:white;transition:all 0.3s;font-family:Tajawal';
      document.body.appendChild(t);
    }
    t.textContent = "تم الحفظ في " + tabName + " ✓";
    t.style.opacity = '1';
    setTimeout(() => t.style.opacity = '0', 3000);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

function syncToAttendanceTab(dateKey, inH, outH){
  let data = JSON.parse(localStorage.getItem('att_fixed_final')||'{}');
  if(!data[dateKey]) data[dateKey]={in:'',out:''};
  if(inH) data[dateKey].in = String(inH);
  if(outH) data[dateKey].out = String(outH);
  localStorage.setItem('att_fixed_final', JSON.stringify(data));
}

function saveDailyEntry(type, category, amount, wallet, notes) {
  const row = [new Date().toISOString().split('T')[0], type, category, amount, wallet, notes, new Date().toLocaleTimeString('ar-EG'), Date.now()];
  let all = JSON.parse(localStorage.getItem('omar_daily') || '[]');
  all.push(row);
  localStorage.setItem('omar_daily', JSON.stringify(all));
  // Firebase
  saveToFirebase("daily_reports", { type, category, amount, wallet, notes, amountNum: Number(amount)||0 });
  return sendToOmarSheet("اليومية - Daily", row);
}

function saveAttendance(inTime, outTime) {
  const today = new Date().toISOString().split('T')[0];
  const row = [today, inTime, outTime, "", "حاضر", "", Date.now()];
  localStorage.setItem('omar_attendance_' + row[0], JSON.stringify(row));
  let now = new Date();
  let key = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
  syncToAttendanceTab(key, inTime, outTime);
  // Firebase
  saveToFirebase("attendance", { name:"عمر", status:"حاضر", date: today, inTime, outTime, year: now.getFullYear(), month: now.getMonth()+1, day: now.getDate() });
  return sendToOmarSheet("الحضور والانصراف - Attendance", row);
}

function saveTask(title, desc, priority, dueDate) {
  const row = [new Date().toISOString().split('T')[0], title, desc, "لم يتم", priority, dueDate, new Date().toLocaleTimeString('ar-EG'), Date.now()];
  let all = JSON.parse(localStorage.getItem('omar_tasks') || '[]');
  all.push(row);
  localStorage.setItem('omar_tasks', JSON.stringify(all));
  // Firebase
  saveToFirebase("tasks", { title, desc, priority, dueDate, done:false });
  return sendToOmarSheet("المهام - Tasks", row);
}

function saveTransaction(type, category, amount, wallet, desc) {
  const row = [new Date().toISOString().split('T')[0], type, category, amount, "", wallet, desc, Date.now()];
  let all = JSON.parse(localStorage.getItem('omar_transactions') || '[]');
  all.push(row);
  localStorage.setItem('omar_transactions', JSON.stringify(all));
  // Firebase
  saveToFirebase("transactions", { type, category, amount, wallet, desc, amountNum: Number(amount)||0 });
  return sendToOmarSheet("العمليات - Transactions", row);
}

console.log("Omar System Ready - Firebase + Sheets");
