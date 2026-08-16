// نظام Omar - مربوط بشيتك - آخر تحديث باللينك الجديد
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzh_9Ob76032uBa-0WqRopMVvZ5nEfwiJ7cE9wSQ8JItDnmGezp40OC23L0oDwlHJetjg/exec";

async function sendToOmarSheet(tabName, rowArray) {
  try {
    fetch(SHEET_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab: tabName, values: rowArray })
    });
    console.log("✅ تم الارسال لـ " + tabName + ":", rowArray);
    // رسالة صغيرة
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

function saveDailyEntry(type, category, amount, wallet, notes) {
  const row = [new Date().toISOString().split('T')[0], type, category, amount, wallet, notes, new Date().toLocaleTimeString('ar-EG'), Date.now()];
  let all = JSON.parse(localStorage.getItem('omar_daily') || '[]');
  all.push(row);
  localStorage.setItem('omar_daily', JSON.stringify(all));
  return sendToOmarSheet("اليومية - Daily", row);
}

function saveAttendance(inTime, outTime) {
  const row = [new Date().toISOString().split('T')[0], inTime, outTime, "", "حاضر", "", Date.now()];
  localStorage.setItem('omar_attendance_' + row[0], JSON.stringify(row));
  return sendToOmarSheet("الحضور والانصراف - Attendance", row);
}

function saveTask(title, desc, priority, dueDate) {
  const row = [new Date().toISOString().split('T')[0], title, desc, "لم يتم", priority, dueDate, new Date().toLocaleTimeString('ar-EG'), Date.now()];
  let all = JSON.parse(localStorage.getItem('omar_tasks') || '[]');
  all.push(row);
  localStorage.setItem('omar_tasks', JSON.stringify(all));
  return sendToOmarSheet("المهام - Tasks", row);
}

function saveTransaction(type, category, amount, wallet, desc) {
  const row = [new Date().toISOString().split('T')[0], type, category, amount, "", wallet, desc, Date.now()];
  let all = JSON.parse(localStorage.getItem('omar_transactions') || '[]');
  all.push(row);
  localStorage.setItem('omar_transactions', JSON.stringify(all));
  return sendToOmarSheet("العمليات - Transactions", row);
}

console.log("Omar System Ready - New URL 
