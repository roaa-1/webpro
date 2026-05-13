document.addEventListener("DOMContentLoaded", () => {
    loadPrerequisites();
});

function loadPrerequisites() {

    fetch("api/get_prerequisites.php")
        .then(res => res.json())
        .then(data => {

            const table = document.querySelector("tbody");
            table.innerHTML = "";

            data.forEach(p => {
                table.innerHTML += `
                    <tr data-id="${p.id}">
                        <td>${p.course_code}</td>
                        <td>${p.course_name}</td>
                        <td>${p.pre_code}</td>
                        <td>${p.pre_name}</td>
                        <td>
                            <i class="fa-solid fa-trash delete"></i>
                        </td>
                    </tr>
                `;
            });
        });
}

// delete
document.querySelector("tbody").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {

        const id = e.target.closest("tr").dataset.id;

        fetch("api/delete_prerequisite.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id=${id}`
        })
        .then(res => res.text())
        .then(res => {
            if (res === "ok") loadPrerequisites();
        });
    }
});