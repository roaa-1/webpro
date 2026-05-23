<?php
session_start();
header("Content-Type: application/json");

ini_set('display_errors', 0);

include '../config/db.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

/* ===== STUDENT LOGIN ===== */
$sql = "SELECT * FROM students WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if (password_verify($password, $row['password'])) {

        $_SESSION['user_id'] = $row['id'];
        $_SESSION['role'] = 'student';

        echo json_encode([
            "status" => "success",
            "role" => "student"
        ]);
        exit;
    }
}

/* ===== ADMIN LOGIN ===== */
$sql = "SELECT * FROM admins WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if (password_verify($password, $row['password'])) {

        $_SESSION['user_id'] = $row['id'];
        $_SESSION['role'] = 'admin';

        echo json_encode([
            "status" => "success",
            "role" => "admin"
        ]);
        exit;
    }
}

/* ===== FAIL ===== */
echo json_encode([
    "status" => "invalid_credentials",
    "message" => "Incorrect email or password."
]);