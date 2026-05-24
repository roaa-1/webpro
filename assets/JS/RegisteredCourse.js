document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
});

function loadCourses() {

    fetch("api/my_courses.php")
        .then(res => res.json())
        .then(data => {

            if (data.error === "unauthorized") {
                window.location.href = "Login.html";
                return;
            }

            const table = document.getElementById("coursesTable");
            table.innerHTML = "";

            let totalHours = 0;

            data.forEach(course => {

                totalHours += Number(course.hours);

                table.innerHTML += `
                    <tr>
                        <td>${course.course_code}</td>
                        <td>${course.title}</td>
                        <td>${course.hours}</td>
                        <td>
                            <button class="delete-btn" onclick="dropCourse(${course.id})">
                                حذف
                            </button>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("totalHours").innerText = totalHours;
            document.getElementById("courseCount").innerText = data.length;

            document.querySelector(".top-title p").innerText =
                `إجمالي الساعات المسجلة: ${totalHours} ساعة معتمدة`;
        });
}

/* DROP */
function dropCourse(id) {

    fetch("api/drop_course.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `course_id=${id}`
    })
    .then(res => res.text())
    .then(res => {

        if (res === "dropped") {
            loadCourses();
        } else {
            alert("error");
        }
    });
}

/* logout */
document.querySelector(".logout-icon").addEventListener("click", () => {
    fetch("auth/logout.php")
        .then(() => {
            localStorage.clear();
            window.location.href = "Login.html";
        });
});