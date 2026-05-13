<?php
session_start();
header("Content-Type: application/json");

include "../config/db.php";

/* =========================
   AUTH CHECK
========================= */
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode([
        "error" => "unauthorized"
    ]);
    exit;
}

$student_id = $_SESSION['user_id'];

/* =========================
   STUDENT DATA
========================= */
$stmt = $conn->prepare("
    SELECT name, student_number
    FROM students
    WHERE id = ?
");

$stmt->bind_param("i", $student_id);
$stmt->execute();
$student_data = $stmt->get_result()->fetch_assoc();

if (!$student_data) {
    echo json_encode(["error" => "student_not_found"]);
    exit;
}

/* =========================
   REGISTERED COURSES
========================= */
$stmt = $conn->prepare("
    SELECT c.course_code, c.title, c.credit_hours
    FROM registrations r
    JOIN courses c ON r.course_id = c.id
    WHERE r.student_id = ?
");

$stmt->bind_param("i", $student_id);
$stmt->execute();

$result = $stmt->get_result();

$courses = [];
$total_hours = 0;

while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
    $total_hours += (int)$row['credit_hours'];
}

/* =========================
   AVAILABLE COURSES (TOTAL)
========================= */
$available = $conn->query("
    SELECT COUNT(*) AS total FROM courses
")->fetch_assoc();

/* =========================
   FINAL RESPONSE
========================= */
echo json_encode([
    "student" => $student_data,
    "registered_count" => count($courses),
    "total_hours" => $total_hours,
    "available_courses" => (int)$available['total'],
    "courses" => $courses
]);
?>