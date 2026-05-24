<?php
session_start();
header("Content-Type: application/json");

include "../config/db.php";

/* =========================
   AUTH CHECK
========================= */
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access."
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
    echo json_encode([
        "status" => "error",
        "message" => "Student not found."
    ]);
    exit;
}

/* =========================
   REGISTERED COURSES
========================= */
$stmt = $conn->prepare("
    SELECT 
        c.id,
        c.course_code,
        c.title,
        c.credit_hours
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
   FULL COURSES COUNT
========================= */
$full_stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM courses c
    WHERE (
        SELECT COUNT(*)
        FROM registrations r
        WHERE r.course_id = c.id
    ) >= c.capacity
");

$full_stmt->execute();

$full_courses = $full_stmt
    ->get_result()
    ->fetch_assoc();

/* =========================
   AVAILABLE COURSES COUNT
========================= */
$available_stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM courses c
    WHERE (
        SELECT COUNT(*)
        FROM registrations r
        WHERE r.course_id = c.id
    ) < c.capacity
");

$available_stmt->execute();

$available_courses = $available_stmt
    ->get_result()
    ->fetch_assoc();

/* =========================
   FINAL RESPONSE
========================= */
echo json_encode([
    "status" => "success",

    "student" => [
        "name" => $student_data['name'],
        "student_number" => $student_data['student_number']
    ],

    "registered_count" => count($courses),

    "total_hours" => $total_hours,

    "available_courses" => (int)$available_courses['total'],

    "full_courses" => (int)$full_courses['total'],

    "courses" => $courses
]);
?>