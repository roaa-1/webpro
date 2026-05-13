<?php
session_start();
include '../config/db.php';

$student_id = $_SESSION['user_id'];

$sql = "SELECT 
    c.id,
    c.course_code,
    c.title,
    c.capacity,

    -- عدد المسجلين
    (SELECT COUNT(*) FROM registrations r WHERE r.course_id = c.id) AS enrolled,

    -- هل الطالب مسجل؟
    EXISTS(
        SELECT 1 FROM registrations r2
        WHERE r2.course_id = c.id AND r2.student_id = ?
    ) AS registered

FROM courses c";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();

$result = $stmt->get_result();

$courses = [];

while ($row = $result->fetch_assoc()) {

    // capacity check
    $row['is_full'] = ($row['enrolled'] >= $row['capacity']);

    // =============================
    // PREREQUISITES
    // =============================

    $course_id = $row['id'];

    $pre_sql = "SELECT prerequisite_course_id 
                FROM course_prerequisites 
                WHERE course_id = ?";

    $pre_stmt = $conn->prepare($pre_sql);
    $pre_stmt->bind_param("i", $course_id);
    $pre_stmt->execute();

    $pre_result = $pre_stmt->get_result();

    $missing = false;
    $prereq_list = [];

    while ($pre = $pre_result->fetch_assoc()) {

        $pre_id = $pre['prerequisite_course_id'];

        // جيب اسم الكورس (code)
        $nameStmt = $conn->prepare("
            SELECT course_code FROM courses WHERE id = ?
        ");
        $nameStmt->bind_param("i", $pre_id);
        $nameStmt->execute();
        $nameResult = $nameStmt->get_result()->fetch_assoc();

        if ($nameResult) {
            $prereq_list[] = $nameResult['course_code'];
        }

        // check إذا الطالب أخد المتطلب
        $check = $conn->prepare("
            SELECT * FROM registrations 
            WHERE student_id = ? AND course_id = ?
        ");

        $check->bind_param("ii", $student_id, $pre_id);
        $check->execute();

        if ($check->get_result()->num_rows == 0) {
            $missing = true;
        }
    }

    // تحويل المتطلبات لنص
    $row['prerequisites'] = empty($prereq_list)
        ? "لا يوجد"
        : implode(", ", $prereq_list);

    $row['not_allowed'] = $missing ? 1 : 0;

    $courses[] = $row;
}

echo json_encode($courses);
?>