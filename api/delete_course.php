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
   VALIDATE ID
========================= */
$course_id = (int) ($_POST['id'] ?? 0);

if ($course_id <= 0) {

    echo json_encode([
        "status" => "invalid",
        "message" => "Invalid course ID."
    ]);

    exit;
}

/* =========================
   CHECK REGISTRATIONS
========================= */
$check = $conn->prepare("
    SELECT id
    FROM registrations
    WHERE course_id = ?
    LIMIT 1
");

$check->bind_param("i", $course_id);
$check->execute();

if ($check->get_result()->num_rows > 0) {

    echo json_encode([
        "status" => "has_registrations",
        "message" => "Cannot delete course with active registrations."
    ]);

    exit;
}

/* =========================
   DELETE PREREQUISITES
========================= */
$deletePre = $conn->prepare("
    DELETE FROM course_prerequisites
    WHERE course_id = ?
    OR prerequisite_course_id = ?
");

$deletePre->bind_param("ii", $course_id, $course_id);
$deletePre->execute();

/* =========================
   DELETE COURSE
========================= */
$stmt = $conn->prepare("
    DELETE FROM courses
    WHERE id = ?
");

$stmt->bind_param("i", $course_id);

if ($stmt->execute()) {

    echo json_encode([
        "status" => "success",
        "message" => "Course deleted successfully."
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Failed to delete course."
    ]);
}
?>