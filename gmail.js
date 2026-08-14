async function sendEmail(to, subject, message) {
  return await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      key: SECRET_KEY,
      action: "sendEmail",
      to: to,
      subject: subject,
      message: message
    })
  });
}