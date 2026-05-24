<?php

include "../config/db.php";

$course_id = $_GET['course_id'];

$stmt = $conn->prepare("
SELECT 
    capacity,
    (
        SELECT COUNT(*) 
        FROM registrations 
        WHERE course_id = ?
    ) AS enrolled
FROM courses
WHERE id = ?
");

$stmt->bind_param("ii", $course_id, $course_id);
$stmt->execute();

$result = $stmt->get_result()->fetch_assoc();

$remaining = $result['capacity'] - $result['enrolled'];

echo json_encode([
    "remaining" => $remaining
]);