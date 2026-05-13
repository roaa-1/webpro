document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

function loadDashboard() {

    fetch("api/get_student_dashboard.php")
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                console.log("Not logged in");
                window.location.href = "Login.html";
                return;
            }

            /* =====================
               TOP BAR
            ===================== */

            document.querySelector(".top-bar h3").innerText =
                `مرحباً، ${data.student.name}`;

            const spans = document.querySelectorAll(".top-bar span");
            spans[0].innerText = `رقم الطالب : ${data.student.student_number}`;

            /* =====================
               CARDS
            ===================== */

            const cards = document.querySelectorAll(".card-box .nam1");

            cards[0].innerText = data.registered_count;
            cards[1].innerText = data.available_courses;
            cards[2].innerText = data.total_hours;

            let progress = Math.round((data.total_hours / 50) * 100);
            cards[3].innerText = progress + "%";

            /* =====================
               COURSES LIST
            ===================== */

            const container = document.querySelector(".courses");

            container.innerHTML = `
                <h5>المساقات المسجلة حالياً</h5>
            `;

            if (data.courses.length === 0) {
                container.innerHTML += `<p>لا يوجد مساقات مسجلة</p>`;
                return;
            }

            data.courses.forEach(c => {
                container.innerHTML += `
                    <div class="course">
                        <div>
                            <h5>${c.title}</h5>
                            <p>${c.credit_hours} ساعات - ${c.course_code}</p>
                        </div>
                        <span class="badge">مسجل</span>
                    </div>
                `;
            });

        })
        .catch(err => {
            console.error("Dashboard error:", err);
        });
}