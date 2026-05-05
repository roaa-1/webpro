const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector(".login-btn");

const users = [
  { email: "student@test.com", password: "1234", role: "student" },
  { email: "admin@test.com", password: "1234", role: "admin" }
];

// 🔥 لما يضغط زر تسجيل الدخول
loginBtn.addEventListener("click", function () {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // reset اللون
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");

  // إذا فاضي
  if (!email || !password) {
    if (!email) emailInput.classList.add("error");
    if (!password) passwordInput.classList.add("error");
    return;
  }

  // البحث عن المستخدم
  const user = users.find(
    u => u.email === email && u.password === password
  );

  // إذا غلط
  if (!user) {
    emailInput.classList.add("error");
    passwordInput.classList.add("error");
    return;
  }

  // تخزين
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userEmail", user.email);

  // 🔥 التحويل حسب الدور
  if (user.role === "admin") {
    window.location.href = "AdministratorDashboard.html";
  } else {
    window.location.href = "StudentDashboard.html";
  }

});

// 🔥 يشيل اللون الأحمر أول ما يكتب
[emailInput, passwordInput].forEach(input => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
  });
});