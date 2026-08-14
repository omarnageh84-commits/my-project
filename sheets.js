// يبعت أي بيانات للشيت
async function saveToSheet(sheetName, data) {
  // sheetName هيبقى بالعربي: "الرئيسية" - "اليومية" - "الحضور" - "المهام"
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        key: SECRET_KEY,
        sheet: sheetName,
        data: data,
        time: new Date().toLocaleString('ar-EG')
      })
    });
    const result = await res.json();
    console.log("تم الحفظ في " + sheetName, result);
    return true;
  } catch (e) {
    console.error("فشل الحفظ", e);
    // لو النت فاصل احفظه مؤقتا في التليفون
    let offline = JSON.parse(localStorage.getItem('offline_' + sheetName) || '[]');
    offline.push(data);
    localStorage.setItem('offline_' + sheetName, JSON.stringify(offline));
    return false;
  }
}

// مثال للاستخدام:
// saveToSheet("الحضور", {الموظف: "عمر", الوقت: "8:00", الحالة: "حضر"})