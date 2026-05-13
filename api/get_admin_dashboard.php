<?php
header("Content-Type: application/json");

// connect database
$conn = new mysqli("localhost", "root", "", "university_system");

if ($conn->connect_error) {
    die(json_encode(["error" => "DB connection failed"]));
}

// 1. total courses
$courses = $conn->query("SELECT COUNT(*) as count FROM courses")->fetch_assoc();

// 2. total students
$students = $conn->query("SELECT COUNT(*) as count FROM students")->fetch_assoc();

// 3. total registrations
$registrations = $conn->query("SELECT COUNT(*) as count FROM registrations")->fetch_assoc();

// 4. last registrations
$last = $conn->query("
    SELECT s.name AS student, c.name AS course, r.date, r.status
    FROM registrations r
    JOIN students s ON r.student_id = s.id
    JOIN courses c ON r.course_id = c.id
    ORDER BY r.date DESC
    LIMIT 5
");

$lastData = [];

while($row = $last->fetch_assoc()){
    $lastData[] = $row;
}

// response
echo json_encode([
    "courses" => $courses['count'],
    "students" => $students['count'],
    "registrations" => $registrations['count'],
    "last" => $lastData
]);

?>