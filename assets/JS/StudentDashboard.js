document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});


function loadDashboard() {

    fetch("/api/get_student_dashboard.php")
        .then(res => res.json())
        .then(data => {

            if (data.error === "unauthorized") {
                window.location.href = "Login.html";
                return;
            }

            /* =====================
               TOP BAR
            ===================== */

            document.getElementById("studentName").innerText =
                `مرحباً، ${data.student.name}`;

            document.getElementById("studentId").innerText =
                data.student.student_number;


            /* =====================
               CARDS (SAFE ACCESS)
            ===================== */

            document.getElementById("registeredCourses").innerText =
                data.registered_count;

            document.getElementById("availableCourses").innerText =
                data.available_courses;

            document.getElementById("availableHours").innerText =
                data.total_hours;


            /* progress (safe + realistic cap 120 credits example) */
            let progress = Math.round((data.total_hours / 120) * 100);
            document.getElementById("progressPercent").innerText =
                progress + "%";


            /* =====================
               COURSES LIST
            ===================== */

            const container = document.getElementById("coursesContainer");
            container.innerHTML = "";

            if (!data.courses || data.courses.length === 0) {
                container.innerHTML = `<p>لا يوجد مساقات مسجلة حالياً 😌</p>`;
                return;
            }

            data.courses.forEach(c => {

                container.innerHTML += `
                    <div class="course d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h5>${c.title}</h5>
                            <p>${c.course_code} - ${c.credit_hours} ساعات</p>
                        </div>
                        <span class="badge bg-success">مسجل</span>
                    </div>
                `;
            });

        })
        .catch(err => {
            console.error("Dashboard error:", err);
        });
}


/* =========================
   LOGOUT FIXED
========================= */
document.querySelector(".logout-icon").addEventListener("click", () => {

    fetch("/auth/logout.php")
        .then(() => {
            localStorage.clear();
            window.location.href = "Login.html";
        });

});