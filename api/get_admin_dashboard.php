<?php
session_start();
header("Content-Type: application/json");

include '../config/db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["error" => "unauthorized"]);
    exit;
}

/* ===== TOTAL COURSES ===== */
$courses = $conn->query("SELECT COUNT(*) as count FROM courses")->fetch_assoc();

/* ===== TOTAL STUDENTS ===== */
$students = $conn->query("SELECT COUNT(*) as count FROM students")->fetch_assoc();

/* ===== TOTAL REGISTRATIONS ===== */
$registrations = $conn->query("SELECT COUNT(*) as count FROM registrations")->fetch_assoc();

/* ===== LAST REGISTRATIONS ===== */
$last = $conn->query("
    SELECT 
        s.name AS student,
        c.course_code AS course,
        r.registration_date AS date
    FROM registrations r
    JOIN students s ON r.student_id = s.id
    JOIN courses c ON r.course_id = c.id
    ORDER BY r.registration_date DESC
    LIMIT 5
");

$lastData = [];

while ($row = $last->fetch_assoc()) {
    $row['status'] = "confirmed";
    $lastData[] = $row;
}

echo json_encode([
    "courses" => $courses['count'],
    "students" => $students['count'],
    "registrations" => $registrations['count'],
    "last" => $lastData
]);
?>