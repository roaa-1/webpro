document.querySelectorAll(".logout-icon").forEach(btn => {

  btn.addEventListener("click", () => {

    fetch("auth/logout.php")
      .then(res => res.json())
      .then(data => {

        if (data.status === "success") {

          localStorage.clear();
          window.location.href = "Login.html";
        }

      })
      .catch(err => {
        console.error("Logout error:", err);
      });

  });

});