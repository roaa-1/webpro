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
$course_id = (int) ($_POST['course_id'] ?? 0);
$pre_id = (int) ($_POST['pre_id'] ?? 0);

if ($course_id <= 0 || $pre_id <= 0) {

    echo json_encode([
        "status" => "validation_error",
        "message" => "Invalid course selection."
    ]);

    exit;
}

/* =========================
   SAME COURSE CHECK
========================= */
if ($course_id === $pre_id) {

    echo json_encode([
        "status" => "same_course",
        "message" => "A course cannot be its own prerequisite."
    ]);

    exit;
}

/* =========================
   DUPLICATE CHECK
========================= */
$check = $conn->prepare("
    SELECT id
    FROM course_prerequisites
    WHERE course_id = ?
    AND prerequisite_course_id = ?
    LIMIT 1
");

$check->bind_param("ii", $course_id, $pre_id);
$check->execute();

if ($check->get_result()->num_rows > 0) {

    echo json_encode([
        "status" => "duplicate",
        "message" => "Prerequisite already exists."
    ]);

    exit;
}

/* =========================
   INSERT PREREQUISITE
========================= */
$stmt = $conn->prepare("
    INSERT INTO course_prerequisites
    (course_id, prerequisite_course_id)
    VALUES (?, ?)
");

$stmt->bind_param("ii", $course_id, $pre_id);

if ($stmt->execute()) {

    echo json_encode([
        "status" => "success",
        "message" => "Prerequisite added successfully."
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Failed to add prerequisite."
    ]);
}
?>
