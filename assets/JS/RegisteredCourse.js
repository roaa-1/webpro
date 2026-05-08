document.querySelectorAll(".sidebar li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".sidebar li").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
  });
});

let buttons = document.querySelectorAll(".delete-btn");

let totalHours = 15;

buttons.forEach(btn => {

    btn.addEventListener("click", () => {

        Swal.fire({
            title: 'هل أنتِ متأكدة؟',
            text: "سيتم حذف المساق من جدولك",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'red',
            cancelButtonColor: '#999',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء'
        }).then((result) => {

            if(result.isConfirmed){

                let row = btn.parentElement.parentElement;

                let courseHours = Number(
                    row.querySelector(".hours").innerText
                );

                totalHours -= courseHours;

                document.querySelector(".footer-left h2").innerText =
                    `${totalHours}/18`;

                document.querySelector(".top-title p").innerText =
                    `إجمالي الساعات المسجلة: ${totalHours} ساعة معتمدة`;

                document.querySelector(".stats .card:nth-child(2) h2").innerText =
                    totalHours;

                row.remove();

                Swal.fire({
                    title: 'تم الحذف',
                    text: 'تم حذف المساق بنجاح',
                    icon: 'success',
                    confirmButtonColor: 'green',
                });

            }

        });

    });

});