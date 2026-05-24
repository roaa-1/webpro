<?php
header("Content-Type: application/json");
include "../config/db.php";

$sql = "
SELECT 
    cp.id,
    c1.course_code AS course_code,
    c1.title AS course_name,
    c2.course_code AS pre_code,
    c2.title AS pre_name
FROM course_prerequisites cp
JOIN courses c1 ON cp.course_id = c1.id
JOIN courses c2 ON cp.prerequisite_course_id = c2.id
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>