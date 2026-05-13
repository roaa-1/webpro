<?php
header("Content-Type: application/json");
include "../config/db.php";

$sql = "
SELECT 
    r.id,
    s.name AS student,
    c.title AS course,
    r.created_at
FROM registrations r
JOIN students s ON r.student_id = s.id
JOIN courses c ON r.course_id = c.id
ORDER BY r.created_at DESC
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>