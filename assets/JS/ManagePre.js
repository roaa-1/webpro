const overlay = document.querySelector(".overlay1");
const addBtn = document.querySelector(".add-btn");
const closeBtn = document.querySelector(".close-btn");
const cancelBtn = document.querySelector(".cancel");
const addRequirementBtn = document.querySelector(".add");

const courseSelect = document.querySelectorAll("select")[0];
const prerequisiteSelect = document.querySelectorAll("select")[1];

const cardsContainer = document.querySelector(".cards");
const tableBody = document.querySelector("tbody");


addBtn.addEventListener("click", () => {
    overlay.classList.remove("d-none");
});

closeBtn.addEventListener("click", () => {
    overlay.classList.add("d-none");
});
cancelBtn.addEventListener("click", () => {
    overlay.classList.add("d-none");
});

addRequirementBtn.addEventListener("click", () => {
    const courseCode = courseSelect.value;
    const prerequisiteText = prerequisiteSelect.value;

    if (
        courseCode === "اختر المساق" ||
        prerequisiteText === "اختر المتطلب"
    ) {
        alert("اختر المساق والمتطلب");
        return;
    }
    const prerequisiteCode = prerequisiteText.split(" - ")[0];
    const prerequisiteName = prerequisiteText.split(" - ")[1];
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const cardCourseCode =
            card.querySelector(".course-code").textContent;
        if (cardCourseCode === courseCode) {
            const reqItem = document.createElement("div");
            reqItem.className = "req-item";
            reqItem.innerHTML = `
                ${prerequisiteName} (${prerequisiteCode})
                <i class="fa-solid fa-trash trash"></i>
            `;
            card.appendChild(reqItem);
        }
    });
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${courseCode}</td>
        <td>${getCourseName(courseCode)}</td>
        <td>${prerequisiteCode}</td>
        <td>${prerequisiteName}</td>
        <td>
            <i class="fa-solid fa-trash delete"></i>
        </td>
    `;
    tableBody.appendChild(row);
    overlay.classList.add("d-none");
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("trash")) {
        e.target.parentElement.remove();
    }
    if (e.target.classList.contains("delete")) {
        e.target.closest("tr").remove();
    }
});
function getCourseName(code) {

    const courses = {
        "CS201": "هياكل البيانات",
        "CS301": "برمجة متقدمة",
        "CS302": "قواعد البيانات",
        "CS401": "الذكاء الاصطناعي"
    };
    return courses[code];
}
document.querySelector(".logout-icon").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "Login.html";
});