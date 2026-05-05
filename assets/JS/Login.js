const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector(".login-btn");

const users = [
  { email: "student@test.com", password: "1234", role: "student" },
  { email: "admin@test.com", password: "1234", role: "admin" }
];

loginBtn.addEventListener("click", function () {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");

  if (!email || !password) {
    if (!email) emailInput.classList.add("error");
    if (!password) passwordInput.classList.add("error");
    return;
  }

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    emailInput.classList.add("error");
    passwordInput.classList.add("error");
    return;
  }

  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userEmail", user.email);

  if (user.role === "admin") {
    window.location.href = "AdministratorDashboard.html";
  } else {
    window.location.href = "StudentDashboard.html";
  }

});

[emailInput, passwordInput].forEach(input => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
  });
});