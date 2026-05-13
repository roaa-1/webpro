<?php
session_start();
include '../config/db.php';

$student_id = $_SESSION['user_id'];
$course_id = $_POST['course_id'];

$sql = "DELETE FROM registrations WHERE student_id = ? AND course_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $student_id, $course_id);

if ($stmt->execute()) {
    echo "dropped";
} else {
    echo "error";
}
?>