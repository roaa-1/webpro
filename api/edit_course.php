<?php
include "../config/db.php";

if (isset($_GET['id'])) {
    $stmt = $conn->prepare("SELECT * FROM courses WHERE id = :id");
    $stmt->execute([':id' => $_GET['id']]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (isset($_POST['update'])) {
    $stmt = $conn->prepare("
        UPDATE courses 
        SET course_code = :code,
            title = :title,
            description = :description,
            capacity = :capacity
        WHERE id = :id
    ");

    $stmt->execute([
        ':code' => $_POST['code'],
        ':title' => $_POST['title'],
        ':description' => $_POST['description'],
        ':capacity' => $_POST['capacity'],
        ':id' => $_POST['id']
    ]);

    header("Location: manage_courses.php");
    exit;
}
?>

<h2>Edit Course</h2>

<form method="POST">
    <input type="hidden" name="id" value="<?= $course['id'] ?>">

    <input type="text" name="code" value="<?= $course['course_code'] ?>" required>
    <input type="text" name="title" value="<?= $course['title'] ?>" required>
    <input type="text" name="description" value="<?= $course['description'] ?>">
    <input type="number" name="capacity" value="<?= $course['capacity'] ?>" required>

    <button type="submit" name="update">Update</button>
</form>