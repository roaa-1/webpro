const searchInput = document.querySelector(".search-input");
const tableRows = document.querySelectorAll("tbody tr");

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    tableRows.forEach(row => {

        const text = row.innerText.toLowerCase();

        if (text.includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});
const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal-overlay");
const closeIcon = document.querySelector(".close-icon");
const cancelBtn = document.querySelector(".cancel-btn");

const form = document.getElementById("courseForm");
const tbody = document.querySelector("tbody");


// =======================
// فتح المودال
// =======================

addBtn.addEventListener("click", () => {

    modal.classList.remove("d-none");

});


// =======================
// إغلاق المودال
// =======================

closeIcon.addEventListener("click", () => {

    modal.classList.add("d-none");

});

cancelBtn.addEventListener("click", () => {

    modal.classList.add("d-none");

});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputs = form.querySelectorAll("input");
    const code = inputs[0].value;
    const name = inputs[1].value;
    const hours = inputs[2].value;
    const capacity = inputs[3].value;
    const teacher = inputs[4].value;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td>${hours}</td>
        <td>${capacity}</td>
        <td>0/${capacity}</td>
        <td>${teacher}</td>
        <td>
            <div class="actions">
                <i class="fa-solid fa-pen"></i>
                <i class="fa-solid fa-trash"></i>
            </div>
        </td>
    `;
    tbody.appendChild(row);
    modal.classList.add("d-none");
    form.reset();

});
// =======================
// التعديل والحذف
// =======================

const editModal = document.querySelector(".edit-course");

const editCloseBtn =
editModal.querySelector(".close-icon");

const editCancelBtn =
editModal.querySelector(".cancel-btn");

const editForm =
editModal.querySelector("form");

let selectedRow = null;


// =======================
// فتح مودال التعديل
// =======================

tbody.addEventListener("click", function(e){

    
    // تعديل
    if(e.target.classList.contains("fa-pen")){

        selectedRow =
        e.target.closest("tr");

        const cells =
        selectedRow.querySelectorAll("td");

        const inputs =
        editModal.querySelectorAll("input");


        // تعبئة البيانات داخل المودال
        inputs[0].value = cells[0].innerText;
        inputs[1].value = cells[1].innerText;
        inputs[2].value = cells[2].innerText;
        inputs[3].value = cells[3].innerText;
        inputs[4].value = cells[5].innerText;


        // إظهار المودال
        editModal.classList.remove("d-none");

    }


    // حذف
    if(e.target.classList.contains("fa-trash")){

        const row =
        e.target.closest("tr");

        row.remove();

    }

});
editCloseBtn.addEventListener("click", () => {
    editModal.classList.add("d-none");
});
editCancelBtn.addEventListener("click", () => {
    editModal.classList.add("d-none");
});
editForm.addEventListener("submit", function(e){
    e.preventDefault();
    const inputs =
    editModal.querySelectorAll("input");
    selectedRow.children[0].innerText =
    inputs[0].value;
    selectedRow.children[1].innerText =
    inputs[1].value;
    selectedRow.children[2].innerText =
    inputs[2].value;
    selectedRow.children[3].innerText =
    inputs[3].value;    
    selectedRow.children[4].innerText =
    `0/${inputs[3].value}`;
    selectedRow.children[5].innerText =
    inputs[4].value;
    editModal.classList.add("d-none");
});