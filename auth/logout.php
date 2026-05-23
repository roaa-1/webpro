<?php
session_start();
header("Content-Type: application/json");

session_unset();
session_destroy();

echo json_encode([
    "status" => "invalid_credentials",
    "message" => "Incorrect email or password."
]);