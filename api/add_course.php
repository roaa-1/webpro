<?php
include "../config/db.php";

$code = $_POST['code'];
$name = $_POST['name'];
$hours = $_POST['hours'];
$capacity = $_POST['capacity'];
$teacher = $_POST['teacher'];

$stmt = $conn->prepare("
    INSERT INTO courses (course_code, title, hours, capacity, teacher)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param("sssis", $code, $name, $hours, $capacity, $teacher);

echo $stmt->execute() ? "ok" : "error";
?>