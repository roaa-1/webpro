let courseList = [
    {id:1, code:"IT301", title:"Web Programming", credits:3, capacity:30, enrolled:25, prereq:["IT201"]},
    {id:2, code:"IT205", title:"Database", credits:3, capacity:25, enrolled:25, prereq:[]}
];

let editingId = null;
let deletingId = null;

function renderTable(){
    let search = document.getElementById("searchInput").value.toLowerCase();
    let tbody = document.getElementById("tableBody");

    tbody.innerHTML = "";

    let list = courseList.filter(c =>
        c.code.toLowerCase().includes(search) ||
        c.title.toLowerCase().includes(search)
    );

    if(list.length === 0){
        tbody.innerHTML = "<tr><td colspan='9'>No courses found</td></tr>";
        return;
    }

    list.forEach(c=>{
        let remaining = c.capacity - c.enrolled;

        let status = "available";
        let text = "Available";

        if(remaining === 0){ status="full"; text="Full";}
        else if(remaining <=5){ status="warning"; text="Nearly Full";}

        tbody.innerHTML += `
        <tr>
            <td>${c.code}</td>
            <td>${c.title}</td>
            <td>${c.credits}</td>
            <td>${c.capacity}</td>
            <td>${c.enrolled}</td>
            <td>${remaining}</td>
            <td>${c.prereq.length ? c.prereq.join(", ") : "None"}</td>
            <td class="${status}">${text}</td>
            <td>
                <button onclick="openEdit(${c.id})">Edit</button>
                <button onclick="startDelete(${c.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}


function openAddModal(){
    editingId = null;
    document.getElementById("modalTitle").innerText="Add Course";

    clearForm();
    openModal();
}

function openEdit(id){
    let c = courseList.find(x=>x.id===id);
    editingId = id;

    document.getElementById("modalTitle").innerText="Edit Course";

    document.getElementById("fCode").value=c.code;
    document.getElementById("fTitle").value=c.title;
    document.getElementById("fCredits").value=c.credits;
    document.getElementById("fCapacity").value=c.capacity;
    document.getElementById("fPrereq").value=c.prereq.join(",");

    openModal();
}

function openModal(){
    document.getElementById("modal").style.display="flex";
}

function closeModal(){
    document.getElementById("modal").style.display="none";
}


function saveCourse(){
    let code = fCode.value.trim();
    let title = fTitle.value.trim();
    let credits = parseInt(fCredits.value);
    let capacity = parseInt(fCapacity.value);
    let prereq = fPrereq.value.split(",").map(x=>x.trim()).filter(x=>x);

    if(!code || !title || !credits || !capacity){
        return showError("Fill all fields");
    }

    if(capacity < 1){
        return showError("Capacity must be > 0");
    }

    if(editingId){
        let c = courseList.find(x=>x.id===editingId);

        if(capacity < c.enrolled){
            return showError("Capacity < enrolled");
        }

        c.code=code;
        c.title=title;
        c.credits=credits;
        c.capacity=capacity;
        c.prereq=prereq;

        showToast("Course updated");

    } else {
        courseList.push({
            id:Date.now(),
            code,title,credits,capacity,
            enrolled:0,
            prereq
        });

        showToast("Course added");
    }

    closeModal();
    renderTable();
}


function startDelete(id){
    deletingId=id;
    let c = courseList.find(x=>x.id===id);
    document.getElementById("deleteText").innerText=`Delete ${c.code}?`;
    document.getElementById("deleteModal").style.display="block";
}

function confirmDelete(){
    courseList = courseList.filter(c=>c.id!==deletingId);
    closeDelete();
    renderTable();
    showToast("Deleted");
}

function closeDelete(){
    document.getElementById("deleteModal").style.display="none";
}


function showError(msg){
    formError.innerText = msg;
}

function clearForm(){
    ["fCode","fTitle","fCredits","fCapacity","fPrereq"].forEach(id=>{
        document.getElementById(id).value="";
    });
    formError.innerText="";
}

function showToast(msg){
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display="block";
    setTimeout(()=>t.style.display="none",2000);
}


document.getElementById("searchInput").addEventListener("input", renderTable);

renderTable();