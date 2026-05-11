
const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {

  const button = dropdown.querySelector(".dropdown-btn");
  const items = dropdown.querySelectorAll(".dropdown-menu div");
  button.addEventListener("click", (e) => {
    e.stopPropagation();

    dropdowns.forEach(d => {
      if(d !== dropdown){
        d.classList.remove("active");
      }
    });
    dropdown.classList.toggle("active");
  });
  items.forEach(item => {

    item.addEventListener("click", () => {

      items.forEach(i => i.classList.remove("active"));

      item.classList.add("active");
      button.innerHTML = `
        ${item.textContent}
        <i class="fa-solid fa-angle-down"></i>
      `;

      button.classList.remove("confirmed", "pending", "rejected");

      if(item.textContent.includes("مؤكد")){
        button.classList.add("confirmed");
      }

      else if(item.textContent.includes("معلق")){
        button.classList.add("pending");
      }

      else if(item.textContent.includes("ملغي")){
        button.classList.add("rejected");
      }

      dropdown.classList.remove("active");
    });
  });
});

document.addEventListener("click", () => {
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove("active");
  });
});
document.querySelectorAll(".sidebar li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".sidebar li").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
  });
});
document.addEventListener("DOMContentLoaded", () => {


  const searchInput = document.getElementById("searchInput");
  const rows = document.querySelectorAll("tbody tr");

  searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    rows.forEach(row => {

      const text = row.innerText.toLowerCase();

      if (text.includes(value)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }

    });

  });



  const statusFilter = document.getElementById("statusFilter");

  statusFilter.addEventListener("change", function () {

    const selected = this.value;

    rows.forEach(row => {

      const statusBtn = row.querySelector(".dropdown-btn");

      const status = statusBtn.textContent.trim();

      if (
        selected === "جميع الحالات" ||
        status.includes(selected)
      ) {
        row.style.display = "";
      }

      else {
        row.style.display = "none";
      }

    });

  });



  const deleteButtons = document.querySelectorAll(".trash");

  deleteButtons.forEach(btn => {

    btn.addEventListener("click", function () {

      const row = this.closest("tr");

      Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تستطيع استرجاع البيانات!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#d33"
      }).then((result) => {

        if (result.isConfirmed) {

          row.remove();

          Swal.fire({
            title: "تم الحذف",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });

        }

      });

    });

  });

  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(dropdown => {

    const button = dropdown.querySelector(".dropdown-btn");

    const items =
      dropdown.querySelectorAll(".dropdown-menu div");

    button.addEventListener("click", (e) => {

      e.stopPropagation();

      dropdowns.forEach(d => {

        if (d !== dropdown) {
          d.classList.remove("active");
        }

      });

      dropdown.classList.toggle("active");

    });

    items.forEach(item => {

      item.addEventListener("click", () => {

        items.forEach(i =>
          i.classList.remove("active")
        );

        item.classList.add("active");

        button.innerHTML = `
          ${item.textContent}
          <i class="fa-solid fa-angle-down"></i>
        `;

        button.classList.remove(
          "confirmed",
          "pending",
          "rejected"
        );

        if (item.textContent.includes("مؤكد")) {
          button.classList.add("confirmed");
        }

        else if (item.textContent.includes("معلق")) {
          button.classList.add("pending");
        }

        else if (item.textContent.includes("ملغي")) {
          button.classList.add("rejected");
        }

        dropdown.classList.remove("active");

      });

    });

  });


  document.addEventListener("click", () => {

    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("active");
    });

  });

});
document.querySelector(".logout-icon").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "Login.html";
});