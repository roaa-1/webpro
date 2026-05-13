<?php
session_start();
header("Content-Type: application/json");

include '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "unauthorized"]);
    exit;
}

$student_id = $_SESSION['user_id'];

/* ===== MAIN COURSES ===== */
$sql = "SELECT 
    c.id,
    c.course_code,
    c.title,
    c.capacity,

    (SELECT COUNT(*) 
     FROM registrations r 
     WHERE r.course_id = c.id) AS enrolled,

    EXISTS(
        SELECT 1 
        FROM registrations r2
        WHERE r2.course_id = c.id 
        AND r2.student_id = ?
    ) AS registered

FROM courses c";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();

$result = $stmt->get_result();

$courses = [];

while ($row = $result->fetch_assoc()) {

    $course_id = $row['id'];

    $row['is_full'] = ($row['enrolled'] >= $row['capacity']);

    /* ===== PREREQUISITES ===== */
    $pre_sql = "SELECT cp.prerequisite_course_id, c.course_code
                FROM course_prerequisites cp
                JOIN courses c ON c.id = cp.prerequisite_course_id
                WHERE cp.course_id = ?";

    $pre_stmt = $conn->prepare($pre_sql);
    $pre_stmt->bind_param("i", $course_id);
    $pre_stmt->execute();
    $pre_result = $pre_stmt->get_result();

    $missing = false;
    $prereq_list = [];

    while ($pre = $pre_result->fetch_assoc()) {

        $prereq_list[] = $pre['course_code'];

        $check = $conn->prepare("
            SELECT 1 FROM registrations 
            WHERE student_id = ? AND course_id = ?
        ");

        $check->bind_param("ii", $student_id, $pre['prerequisite_course_id']);
        $check->execute();

        if ($check->get_result()->num_rows == 0) {
            $missing = true;
        }
    }

    $row['prerequisites'] = empty($prereq_list)
        ? "لا يوجد"
        : implode(", ", $prereq_list);

    $row['not_allowed'] = $missing ? 1 : 0;

    $courses[] = $row;
}

echo json_encode($courses);
?>