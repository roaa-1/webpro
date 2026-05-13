document.querySelector(".logout-icon").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "Login.html";
});

// fetch dashboard data
fetch("api/get_admin_dashboard.php")
  .then(res => res.json())
  .then(data => {

    document.getElementById("totalCourses").innerText = data.courses;
    document.getElementById("totalStudents").innerText = data.students;
    document.getElementById("totalRegs").innerText = data.registrations;

    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.last.forEach(row => {
      tbody.innerHTML += `
        <tr>
          <td>${row.student}</td>
          <td>${row.course}</td>
          <td>${row.date}</td>
          <td>
            <span class="status green">${row.status}</span>
          </td>
        </tr>
      `;
    });

  });