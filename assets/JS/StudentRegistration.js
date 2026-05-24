document.querySelector(".logout-icon").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "Login.html";
});

fetch("api/get_student_dashboard.php")
  .then(res => res.json())
  .then(data => {

    // student info
    document.getElementById("studentName").innerText =
      "مرحباً، " + data.student.name;

    document.getElementById("studentId").innerText =
      data.student.id;

    // stats
    document.getElementById("registeredCourses").innerText =
      data.registeredCount;

    document.getElementById("availableCourses").innerText =
      data.availableCourses;

    document.getElementById("availableHours").innerText =
      18 - data.hours;

    document.getElementById("progressPercent").innerText =
      Math.round((data.hours / 18) * 100) + "%";

    // courses list
    let container = document.getElementById("coursesContainer");
    container.innerHTML = "";

    data.courses.forEach(c => {
      container.innerHTML += `
        <div class="course">
            <div class="d-flex flex-column">
                <h5>${c.name}</h5>
                <p class="nam2">${c.hours} ساعات - ${c.code}</p>
            </div>
            <span class="badge">مسجل</span>
        </div>
      `;
    });

  });