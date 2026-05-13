<?php
session_start();
header("Content-Type: application/json");

include '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "unauthorized"]);
    exit;
}

$student_id = $_SESSION['user_id'];
$course_id = $_POST['course_id'];

/* =========================
   1. DUPLICATE CHECK
========================= */
$check = $conn->prepare("
    SELECT 1 FROM registrations 
    WHERE student_id = ? AND course_id = ?
    LIMIT 1
");

$check->bind_param("ii", $student_id, $course_id);
$check->execute();

if ($check->get_result()->num_rows > 0) {
    echo json_encode(["status" => "already_registered"]);
    exit;
}


/* =========================
   2. CAPACITY CHECK
========================= */
$cap = $conn->prepare("
    SELECT capacity,
           (SELECT COUNT(*) 
            FROM registrations 
            WHERE course_id = ?) AS enrolled
    FROM courses 
    WHERE id = ?
");

$cap->bind_param("ii", $course_id, $course_id);
$cap->execute();

$data = $cap->get_result()->fetch_assoc();

if ($data['enrolled'] >= $data['capacity']) {
    echo json_encode(["status" => "full"]);
    exit;
}


/* =========================
   3. PREREQUISITES CHECK
========================= */
$pre = $conn->prepare("
    SELECT prerequisite_course_id 
    FROM course_prerequisites 
    WHERE course_id = ?
");

$pre->bind_param("i", $course_id);
$pre->execute();

$res = $pre->get_result();

while ($row = $res->fetch_assoc()) {

    $pid = $row['prerequisite_course_id'];

    $checkPre = $conn->prepare("
        SELECT 1 
        FROM registrations 
        WHERE student_id = ? AND course_id = ?
        LIMIT 1
    ");

    $checkPre->bind_param("ii", $student_id, $pid);
    $checkPre->execute();

    if ($checkPre->get_result()->num_rows == 0) {
        echo json_encode(["status" => "missing_prerequisites"]);
        exit;
    }
}


/* =========================
   4. INSERT
========================= */
$stmt = $conn->prepare("
    INSERT INTO registrations (student_id, course_id)
    VALUES (?, ?)
");

$stmt->bind_param("ii", $student_id, $course_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "registered"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>