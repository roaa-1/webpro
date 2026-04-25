const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

const users = [
  { email: "student@test.com", password: "1234", role: "student" },
  { email: "admin@test.com", password: "1234", role: "admin" }
];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  errorMsg.innerText = "";

  if (!email || !password) {
    errorMsg.innerText = "Please fill all fields";
    return;
  }

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    showToast("Wrong email or password");
    return;
  }

  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userEmail", user.email);

  showToast("Login successful");

  setTimeout(() => {
    if (user.role === "admin") {
      window.location.href = "AdminDashboard.html";
    } else {
      window.location.href = "StudentDashboard.html";
    }
  }, 800);
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}