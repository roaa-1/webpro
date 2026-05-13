<?php
session_start();
header("Content-Type: application/json");
include '../config/db.php';

$email = $_POST['email'];
$password = $_POST['password'];

/* ===== check student ===== */
$sql = "SELECT * FROM students WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if ($row['password'] === $password) {

        $_SESSION['user_id'] = $row['id'];
        $_SESSION['role'] = 'student';

        echo json_encode([
            "status" => "success",
            "role" => "student"
        ]);
        exit;
    }
}

/* ===== check admin ===== */
$sql = "SELECT * FROM admins WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if ($row['password'] === $password) {

        $_SESSION['user_id'] = $row['id'];
        $_SESSION['role'] = 'admin';

        echo json_encode([
            "status" => "success",
            "role" => "admin"
        ]);
        exit;
    }
}

/* ===== error ===== */
echo json_encode([
    "status" => "error"
]);
?>