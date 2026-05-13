const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector(".login-btn");

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

  fetch("auth/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
    .then(res => res.json())
    .then(data => {

      if (data.status === "error") {
        emailInput.classList.add("error");
        passwordInput.classList.add("error");
        return;
      }

      // localStorage بس كـ helper
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");

      if (data.role === "admin") {
        window.location.href = "AdministratorDashboard.html";
      } else {
        window.location.href = "StudentDashboard.html";
      }

    })
    .catch(err => {
      console.error("Login error:", err);
    });
});

[emailInput, passwordInput].forEach(input => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
  });
});