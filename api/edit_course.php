<?php
session_start();
header("Content-Type: application/json");

include "../config/db.php";

/* =========================
   AUTH CHECK
========================= */
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {

    echo json_encode([
        "status" => "unauthorized"
    ]);

    exit;
}

/* =========================
   VALIDATE INPUT
========================= */
$id = (int) ($_POST['id'] ?? 0);

$code = trim($_POST['code'] ?? '');
$title = trim($_POST['title'] ?? '');
$hours = (int) ($_POST['hours'] ?? 0);
$capacity = (int) ($_POST['capacity'] ?? 0);
$teacher = trim($_POST['teacher'] ?? '');

if (
    $id <= 0 ||
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
   DUPLICATE CODE CHECK
========================= */
$check = $conn->prepare("
    SELECT id
    FROM courses
    WHERE course_code = ?
    AND id != ?
    LIMIT 1
");

$check->bind_param("si", $code, $id);
$check->execute();

if ($check->get_result()->num_rows > 0) {

    echo json_encode([
        "status" => "duplicate",
        "message" => "Course code already exists."
    ]);

    exit;
}

/* =========================
   UPDATE COURSE
========================= */
$stmt = $conn->prepare("
    UPDATE courses
    SET
        course_code = ?,
        title = ?,
        credit_hours = ?,
        capacity = ?,
        teacher = ?
    WHERE id = ?
");

$stmt->bind_param(
    "ssiisi",
    $code,
    $title,
    $hours,
    $capacity,
    $teacher,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => "success",
        "message" => "Course updated successfully."
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Failed to update course."
    ]);
}
?>