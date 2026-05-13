<?php
$conn = new mysqli("localhost", "root", "", "university_db3");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>