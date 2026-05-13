function registerCourse(id) {

    fetch("api/register_course.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `course_id=${id}`
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {
            alert("تم التسجيل بنجاح ");
        }
        else if (data.status === "full") {
            alert("المساق ممتلئ ");
        }
        else if (data.status === "already_registered") {
            alert("أنت مسجل مسبقاً ");
        }
        else {
            alert(" خطأ ");
        }

        loadCourses();
    });
}