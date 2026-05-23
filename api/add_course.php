<?php
session_start();
header("Content-Type: application/json");

include "../config/db.php";

/* =========================
   AUTH CHECK
========================= */
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode([
        "status" => "unauthorized",
        "message" => "Access denied."
    ]);
    exit;
}

/* =========================
   VALIDATE INPUT
========================= */
$code = trim($_POST['code'] ?? '');
$title = trim($_POST['title'] ?? '');
$hours = (int) ($_POST['hours'] ?? 0);
$capacity = (int) ($_POST['capacity'] ?? 0);
$teacher = trim($_POST['teacher'] ?? '');

if (
    empty($code) ||
    empty($title) ||
    $hours <= 0 ||
    $capacity <= 0 ||
    empty($teacher)
) {
    echo json_encode([
        "status" => "validation_error",
        "message" => "Please fill all fields correctly."
    ]);
    exit;
}

/* =========================
   DUPLICATE CHECK
========================= */
$check = $conn->prepare("
    SELECT id
    FROM courses
    WHERE course_code = ?
    LIMIT 1
");

$check->bind_param("s", $code);
$check->execute();

if ($check->get_result()->num_rows > 0) {
    echo json_encode([
        "status" => "duplicate",
        "message" => "Course code already exists."
    ]);
    exit;
}

/* =========================
   INSERT COURSE
========================= */
$stmt = $conn->prepare("
    INSERT INTO courses
    (course_code, title, credit_hours, capacity, teacher)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssiis",
    $code,
    $title,
    $hours,
    $capacity,
    $teacher
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => "success",
        "message" => "Course added successfully."
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Failed to add course."
    ]);
}
?>