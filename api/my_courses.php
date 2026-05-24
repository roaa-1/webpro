<?php
session_start();
header("Content-Type: application/json");

include '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "unauthorized"]);
    exit;
}

$student_id = $_SESSION['user_id'];

$sql = "SELECT 
            c.id,
            c.course_code,
            c.title,
            c.hours
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