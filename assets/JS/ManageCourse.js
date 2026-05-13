document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
});

// ================= LOAD =================
function loadCourses() {

    fetch("api/get_courses.php")
        .then(res => res.json())
        .then(data => {

            const tbody = document.querySelector("tbody");
            tbody.innerHTML = "";

            data.forEach(c => {

                tbody.innerHTML += `
                    <tr data-id="${c.id}">
                        <td>${c.course_code}</td>
                        <td>${c.title}</td>
                        <td>${c.hours}</td>
                        <td>${c.capacity}</td>
                        <td>0/${c.capacity}</td>
                        <td>${c.teacher}</td>
                        <td>
                            <div class="actions">
                                <i class="fa-solid fa-pen edit"></i>
                                <i class="fa-solid fa-trash delete"></i>
                            </div>
                        </td>
                    </tr>
                `;
            });
        });
}

// ================= ADD =================
const form = document.getElementById("courseForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");

    fetch("api/add_course.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `code=${inputs[0].value}&name=${inputs[1].value}&hours=${inputs[2].value}&capacity=${inputs[3].value}&teacher=${inputs[4].value}`
    })
    .then(res => res.text())
    .then(res => {
        if (res === "ok") {
            loadCourses();
            form.reset();
            document.querySelector(".modal-overlay").classList.add("d-none");
        }
    });
});

// ================= DELETE =================
document.querySelector("tbody").addEventListener("click", function (e) {

    if (e.target.classList.contains("delete")) {

        const id = e.target.closest("tr").dataset.id;

        fetch("api/delete_course.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id=${id}`
        })
        .then(res => res.text())
        .then(res => {
            if (res === "ok") {
                loadCourses();
            }
        });
    }
});