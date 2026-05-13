document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
});

function loadCourses() {

    fetch("student/my_courses.php")
        .then(res => res.json())
        .then(data => {

            const table = document.getElementById("coursesTable");
            table.innerHTML = "";

            let totalHours = 0;

            data.forEach(course => {

                totalHours += Number(course.hours);

                table.innerHTML += `
                    <tr>
                        <td>${course.course_code}</td>
                        <td>${course.title}</td>
                        <td class="hours">${course.hours}</td>
                        <td>
                            <button class="delete-btn" onclick="dropCourse(${course.id})">
                                <i class="fa-solid fa-trash"></i> حذف
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


// DROP COURSE
function dropCourse(courseId) {

    Swal.fire({
        title: 'هل أنتِ متأكدة؟',
        text: "سيتم حذف المساق",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: '#999',
        confirmButtonText: 'نعم احذف'
    }).then((result) => {

        if (!result.isConfirmed) return;

        fetch("student/drop_course.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `course_id=${courseId}`
        })
            .then(res => res.text())
            .then(data => {

                if (data === "dropped") {
                    Swal.fire("تم الحذف", "", "success");
                    loadCourses(); // refresh
                } else {
                    Swal.fire("خطأ", "", "error");
                }
            });
    });
}


// logout
document.querySelector(".logout-icon").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "Login.html";
});