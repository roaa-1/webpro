
document.querySelectorAll(".sidebar li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".sidebar li").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
  });
});

let completed = ["CS101"];
let registered = [];

function render(){
    let rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        let code = row.children[0].innerText;
        let capacityCell = row.children[2];
        let prereq = row.children[3].innerText;
        let actionCell = row.children[4];

        let isFull = capacityCell.classList.contains("full");

        let prereqList = prereq === "لا يوجد" ? [] : prereq.split(",");
        let meets = prereqList.every(p => completed.includes(p.trim()));

        if(registered.includes(code)){
            actionCell.innerHTML = `<span class="btn-disabled">مسجل</span>`;
        }
        else if(isFull){
            actionCell.innerHTML = `<span class="btn-disabled">ممتلئ</span>`;
        }
        else if(!meets){
            actionCell.innerHTML = `<span class="btn-warn">متطلبات غير مكتملة</span>`;
        }
        else{
            actionCell.innerHTML = `<span class="btn-reg" onclick="registerCourse('${code}', this)">تسجيل</span>`;
        }

    });
}
function registerCourse(code, btn){
    if(registered.includes(code)){
        showToast("مسجل مسبقاً");
        return;
    }
    registered.push(code);
    btn.blur();
    btn.outerHTML = `<span class="btn-disabled">مسجل</span>`;

    showToast("تم التسجيل بنجاح");
}
function showToast(msg){
    let t = document.createElement("div");
    t.innerText = msg;

    t.style.position = "fixed";
    t.style.top = "20px";
    t.style.left = "20px";
    t.style.background = "green";
    t.style.color = "white";
    t.style.padding = "10px 20px";
    t.style.borderRadius = "8px";
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2000);
}
document.querySelector(".search-box input").addEventListener("input", function(){
    let value = this.value.toLowerCase();
    let rows = document.querySelectorAll("tbody tr");

    rows.forEach(row=>{
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(value) ? "" : "none";
    });
});

render();