<?php
session_start();
header("Content-Type: application/json");

include '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "unauthorized"]);
    exit;
}

$student_id = $_SESSION['user_id'];
$course_id = $_POST['course_id'];

$sql = "DELETE FROM registrations WHERE student_id = ? AND course_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $student_id, $course_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "dropped"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>