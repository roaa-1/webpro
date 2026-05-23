<?php

session_start();
header("Content-Type: application/json");

include "../config/db.php";

/* =========================
   AUTH CHECK
========================= */

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {

    echo json_encode([
        "error" => "unauthorized"
    ]);

    exit;
}

/* =========================
   TOTAL COUNTS
========================= */

$courses = $conn->query("
    SELECT COUNT(*) AS count
    FROM courses
")->fetch_assoc();

$students = $conn->query("
    SELECT COUNT(*) AS count
    FROM students
")->fetch_assoc();

$registrations = $conn->query("
    SELECT COUNT(*) AS count
    FROM registrations
")->fetch_assoc();

/* =========================
   FULL COURSES
========================= */

$full = $conn->query("
    SELECT COUNT(*) AS count
    FROM courses c
    WHERE (
        SELECT COUNT(*)
        FROM registrations r
        WHERE r.course_id = c.id
    ) >= c.capacity
")->fetch_assoc();

/* =========================
   AVAILABLE COURSES
========================= */

$available = $conn->query("
    SELECT COUNT(*) AS count
    FROM courses c
    WHERE (
        SELECT COUNT(*)
        FROM registrations r
        WHERE r.course_id = c.id
    ) < c.capacity
")->fetch_assoc();

/* =========================
   LAST REGISTRATIONS
========================= */

$last = $conn->query("
    SELECT
        s.name AS student,
        c.course_code AS course,
        r.registration_date AS date
    FROM registrations r
    JOIN students s
        ON r.student_id = s.id
    JOIN courses c
        ON r.course_id = c.id
    ORDER BY r.registration_date DESC
    LIMIT 5
");

$lastData = [];

while ($row = $last->fetch_assoc()) {

    $row['status'] = "confirmed";

    $lastData[] = $row;
}

/* =========================
   ADMIN REPORT
========================= */

$report = $conn->query("
    SELECT
        c.course_code,
        c.title,
        COUNT(r.id) AS total_students
    FROM courses c
    LEFT JOIN registrations r
        ON c.id = r.course_id
    GROUP BY c.id
");

$reportData = [];

while ($row = $report->fetch_assoc()) {

    $reportData[] = $row;
}

/* =========================
   FINAL RESPONSE
========================= */

echo json_encode([

    "courses" => (int)$courses['count'],

    "students" => (int)$students['count'],

    "registrations" => (int)$registrations['count'],

    "full_courses" => (int)$full['count'],

    "available_courses" => (int)$available['count'],

    "last" => $lastData,

    "report" => $reportData
]);
?>