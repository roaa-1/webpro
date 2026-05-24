<?php
include "../config/db.php";

$id = $_POST['id'];
$code = $_POST['code'];
$name = $_POST['name'];
$hours = $_POST['hours'];
$capacity = $_POST['capacity'];
$teacher = $_POST['teacher'];

$stmt = $conn->prepare("
    UPDATE courses 
    SET course_code=?, title=?, hours=?, capacity=?, teacher=?
    WHERE id=?
");

$stmt->bind_param("ssissi", $code, $name, $hours, $capacity, $teacher, $id);

echo $stmt->execute() ? "ok" : "error";
?>