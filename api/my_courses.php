<?php
session_start();
include '../config/db.php';

$student_id = $_SESSION['user_id'];

$sql = "SELECT c.id, c.course_code, c.title, c.hours
        FROM courses c
        JOIN registrations r ON c.id = r.course_id
        WHERE r.student_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>