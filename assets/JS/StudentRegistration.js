const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");

const role = localStorage.getItem("userRole");

if (role !== "student") {
  window.location.href = "login.html";
}

let courses = [
  { id: 1, code: "CS101", title: "Intro to Programming", capacity: 30, enrolled: 25 },
  { id: 2, code: "CS102", title: "Data Structures", capacity: 25, enrolled: 25 },
  { id: 3, code: "CS103", title: "Databases", capacity: 20, enrolled: 10 }
];

addBtn.style.display = "none";

function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(course => {
    const remaining = course.capacity - course.enrolled;

    tableBody.innerHTML += `
      <tr>
        <td>${course.code}</td>
        <td>${course.title}</td>
        <td>${course.capacity}</td>
        <td>${course.enrolled}</td>
        <td>${remaining}</td>
        <td>
          <button class="register"
            onclick="registerCourse(${course.id})"
            ${remaining === 0 ? "disabled" : ""}>
            Register
          </button>
        </td>
      </tr>
    `;
  });
}

function registerCourse(id) {
  const course = courses.find(c => c.id === id);

  if (!course) return;

  if (course.enrolled >= course.capacity) {
    showToast("Course is full");
    return;
  }

  course.enrolled++;
  showToast("Registered successfully");
  renderTable(courses);
}

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = courses.filter(c =>
    c.code.toLowerCase().includes(value) ||
    c.title.toLowerCase().includes(value)
  );

  renderTable(filtered);
});

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

renderTable(courses);