let courseList = [
    {id:1, code:"IT301", title:"Web Programming", prerequisites:[]},
    {id:2, code:"IT205", title:"Database", prerequisites:[1]}
];

function fillSelects(){
    let target = document.getElementById("targetCourse");
    let prereq = document.getElementById("prereqCourse");

    target.innerHTML = "<option value=''>Select Course</option>";
    prereq.innerHTML = "<option value=''>Select Prerequisite</option>";

    courseList.forEach(c=>{
        target.innerHTML += `<option value="${c.id}">${c.code}</option>`;
        prereq.innerHTML += `<option value="${c.id}">${c.code}</option>`;
    });
}


function render(){
    let list = document.getElementById("list");
    list.innerHTML = "";

    courseList.forEach(c=>{

        let prereqs = c.prerequisites.map(pid=>{
            let p = courseList.find(x=>x.id===pid);
            return `<span class="badge">
                ${p.code}
                <button onclick="remove(${c.id},${pid})">x</button>
            </span>`;
        }).join("");

        list.innerHTML += `
        <div class="prereq-row">
            <div>${c.code}</div>
            <div>${prereqs || "None"}</div>
        </div>
        `;
    });
}


function addPrereq(){
    let t = parseInt(targetCourse.value);
    let p = parseInt(prereqCourse.value);

    if(!t || !p){
        return showError("Select both fields");
    }

    if(t === p){
        return showError("Course cannot depend on itself");
    }

    let course = courseList.find(x=>x.id===t);

    if(course.prerequisites.includes(p)){
        return showError("Already added");
    }

    course.prerequisites.push(p);

    clearError();
    render();
    showToast("Added successfully");
}


function remove(courseId, prereqId){
    let c = courseList.find(x=>x.id===courseId);
    c.prerequisites = c.prerequisites.filter(x=>x!==prereqId);

    render();
    showToast("Removed");
}


function showError(msg){
    errorBox.innerText = msg;
}

function clearError(){
    errorBox.innerText = "";
}

function showToast(msg){
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display="block";
    setTimeout(()=>t.style.display="none",2000);
}


fillSelects();
render();