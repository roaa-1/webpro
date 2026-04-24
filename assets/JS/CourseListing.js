let courses = [
    {id:1, code:"IT301", title:"Web Programming", credits:3, capacity:30, enrolled:25, prerequisites:[2]},
    {id:2, code:"IT201", title:"Intro to IT", credits:3, capacity:30, enrolled:30, prerequisites:[]}
];

let registered = [];
let completed = [2]; // completed courses
let activeFilter = "all";
let selectedCourse = null;


function render(){
    let container = document.getElementById("coursesContainer");
    let search = document.getElementById("searchInput").value.toLowerCase();

    container.innerHTML = "";

    let list = courses.filter(c=>{
        let match = c.code.toLowerCase().includes(search) || c.title.toLowerCase().includes(search);
        if(!match) return false;

        if(activeFilter==="registered") return registered.includes(c.id);
        if(activeFilter==="full") return c.enrolled >= c.capacity;
        if(activeFilter==="available") return canRegister(c);

        return true;
    });

    if(list.length===0){
        container.innerHTML = "<p>No courses found</p>";
        return;
    }

    list.forEach(c=>{
        let div = document.createElement("div");
        div.className="card";

        let remaining = c.capacity - c.enrolled;

        let btn = "";

        if(registered.includes(c.id)){
            btn = `<button class="btn btn-disabled">Registered</button>`;
        }
        else if(c.enrolled >= c.capacity){
            btn = `<button class="btn btn-full">Full</button>`;
        }
        else if(!meetsPrereq(c)){
            btn = `<button class="btn btn-warn" onclick="showPrereq(${c.id})">Missing Prereq</button>`;
        }
        else{
            btn = `<button class="btn btn-ok" onclick="openRegister(${c.id})">Register</button>`;
        }

        div.innerHTML = `
            <h3>${c.code}</h3>
            <p>${c.title}</p>
            <p class="meta">${c.credits} credits</p>
            <p class="meta">Remaining: ${remaining}</p>
            ${btn}
        `;

        container.appendChild(div);
    });
}


function canRegister(c){
    return !registered.includes(c.id) && c.enrolled < c.capacity && meetsPrereq(c);
}

function meetsPrereq(c){
    return c.prerequisites.every(p => completed.includes(p));
}


function openRegister(id){
    selectedCourse = id;
    let c = courses.find(x=>x.id===id);
    courseInfo.innerText = c.code + " - " + c.title;
    document.getElementById("registerModal").style.display="flex";
}

function confirmRegister(){
    let c = courses.find(x=>x.id===selectedCourse);
    registered.push(c.id);
    c.enrolled++;

    closeModal();
    showToast("Registered successfully");
    render();
}


function showPrereq(id){
    let c = courses.find(x=>x.id===id);
    let missing = c.prerequisites.filter(p=>!completed.includes(p));

    prereqInfo.innerHTML = missing.map(m=>{
        let cc = courses.find(x=>x.id===m);
        return `<p>${cc.code}</p>`;
    }).join("");

    document.getElementById("prereqModal").style.display="flex";
}

function closePrereq(){
    document.getElementById("prereqModal").style.display="none";
}


function closeModal(){
    document.getElementById("registerModal").style.display="none";
}


function setFilter(f){
    activeFilter=f;
    document.querySelectorAll(".filters button").forEach(b=>b.classList.remove("active"));
    document.getElementById("f-"+f).classList.add("active");
    render();
}


function showToast(msg){
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display="block";
    setTimeout(()=>t.style.display="none",2000);
}


document.getElementById("searchInput").addEventListener("input", render);

render();