<?php
session_start();
header("Content-Type: application/json");

/* تدمير الجلسة بالكامل */
session_unset();
session_destroy();

echo json_encode([
    "status" => "success"
]);
?>