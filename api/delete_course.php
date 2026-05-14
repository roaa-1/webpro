<?php
include "../config/db.php";

if (isset($_GET['id'])) {
    $stmt = $conn->prepare("DELETE FROM courses WHERE id = :id");
    $stmt->execute([':id' => $_GET['id']]);
}

header("Location: manage_courses.php");
exit;
?>