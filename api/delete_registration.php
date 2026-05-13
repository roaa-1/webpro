<?php
include "../config/db.php";

$id = $_POST['id'];

$stmt = $conn->prepare("DELETE FROM registrations WHERE id=?");
$stmt->bind_param("i", $id);

echo $stmt->execute() ? "ok" : "error";
?>