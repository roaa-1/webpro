<?php
include "../config/db.php";

$course_id = $_POST['course_id'];
$pre_id = $_POST['pre_id'];

$stmt = $conn->prepare("
    INSERT INTO course_prerequisites (course_id, prerequisite_course_id)
    VALUES (?, ?)
");

$stmt->bind_param("ii", $course_id, $pre_id);

echo $stmt->execute() ? "ok" : "error";
?>