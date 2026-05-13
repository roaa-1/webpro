document.querySelector(".logout-icon").addEventListener("click", () => {

    fetch("/auth/logout.php")
        .then(() => {
            localStorage.clear();
            window.location.href = "Login.html";
        });

});


fetch("/api/get_admin_dashboard.php")
    .then(res => res.json())
    .then(data => {

        if (data.error === "unauthorized") {
            window.location.href = "Login.html";
            return;
        }

        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        data.last.forEach(row => {
            tbody.innerHTML += `
                <tr>
                    <td>${row.student}</td>
                    <td>${row.course}</td>
                    <td>${row.date}</td>
                    <td><span class="status green">${row.status}</span></td>
                </tr>
            `;
        });

    })
    .catch(err => console.error("Admin dashboard error:", err));