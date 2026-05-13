<?php
session_start();
include '../config/db.php';

$student_id = $_SESSION['user_id'];
$course_id = $_POST['course_id'];


// 1. duplicate check
$check = $conn->prepare("
    SELECT * FROM registrations 
    WHERE student_id=? AND course_id=?
");
$check->bind_param("ii", $student_id, $course_id);
$check->execute();

if ($check->get_result()->num_rows > 0) {
    echo "already registered";
    exit;
}


// 2. capacity check
$cap = $conn->prepare("
    SELECT capacity,
    (SELECT COUNT(*) FROM registrations WHERE course_id=?) AS enrolled
    FROM courses WHERE id=?
");
$cap->bind_param("ii", $course_id, $course_id);
$cap->execute();

$data = $cap->get_result()->fetch_assoc();

if ($data['enrolled'] >= $data['capacity']) {
    echo "course full";
    exit;
}


// 3. prerequisite check
$pre = $conn->prepare("
    SELECT prerequisite_course_id 
    FROM course_prerequisites 
    WHERE course_id=?
");

$pre->bind_param("i", $course_id);
$pre->execute();

$res = $pre->get_result();

while ($row = $res->fetch_assoc()) {

    $pid = $row['prerequisite_course_id'];

    $checkPre = $conn->prepare("
        SELECT * FROM registrations 
        WHERE student_id=? AND course_id=?
    ");

    $checkPre->bind_param("ii", $student_id, $pid);
    $checkPre->execute();

    if ($checkPre->get_result()->num_rows == 0) {
        echo "missing prerequisites";
        exit;
    }
}


// 4. insert registration
$stmt = $conn->prepare("
    INSERT INTO registrations (student_id, course_id)
    VALUES (?, ?)
");

$stmt->bind_param("ii", $student_id, $course_id);

echo $stmt->execute() ? "registered" : "error";
?>