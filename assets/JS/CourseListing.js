document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
});

/* =========================
   LOAD COURSES
========================= */
function loadCourses() {

    fetch("api/get_courses.php")
        .then(res => res.json())
        .then(data => {

            const table = document.getElementById("coursesTable");
            table.innerHTML = "";

            data.forEach(course => {

                let btn = "";

                if (course.registered == 1) {
                    btn = `<span class="btn-disabled">مسجل</span>`;
                }
                else if (course.is_full) {
                    btn = `<span class="btn-disabled">ممتلئ</span>`;
                }
                else if (course.not_allowed == 1) {
                    btn = `<span class="btn-warn">متطلبات غير مكتملة</span>`;
                }
                else {
                    btn = `<span class="btn-reg" onclick="registerCourse(${course.id})">تسجيل</span>`;
                }

                table.innerHTML += `
                    <tr>
                        <td>${course.course_code}</td>
                        <td>${course.title}</td>
                        <td>${course.enrolled}/${course.capacity}</td>
                        <td>${course.prerequisites}</td>
                        <td>${btn}</td>
                    </tr>
                `;
            });

        })
        .catch(err => console.error("Error:", err));
}

/* =========================
   REGISTER COURSE
========================= */
function registerCourse(id) {

    fetch("api/register_course.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `course_id=${id}`
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        loadCourses();
    })
    .catch(err => console.error("Register error:", err));
}

/* =========================
   LOGOUT
========================= */
document.querySelector(".logout-icon").addEventListener("click", () => {
    fetch("auth/logout.php")
        .then(() => {
            localStorage.clear();
            window.location.href = "Login.html";
        });
});