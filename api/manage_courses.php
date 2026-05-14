<?php
require_once "../config/db.php";
require_once "../models/Course.php";

$course = new Course($conn);

// Add course
if (isset($_POST['add'])) {
    $course->add(
        $_POST['code'],
        $_POST['name'],
        $_POST['hours'],
        $_POST['desc']
    );
}

// Delete course
if (isset($_GET['delete'])) {
    $course->delete($_GET['delete']);
}

$courses = $course->getAll();
?>

<h2>Manage Courses</h2>

<form method="POST">
    <input type="text" name="code" placeholder="Course Code" required>
    <input type="text" name="name" placeholder="Course Name" required>
    <input type="number" name="hours" placeholder="Credit Hours" required>
    <textarea name="desc" placeholder="Description"></textarea>
    <button type="submit" name="add">Add Course</button>
</form>

<hr>

<table border="1">
    <tr>
        <th>Code</th>
        <th>Name</th>
        <th>Hours</th>
        <th>Action</th>
    </tr>

    <?php foreach ($courses as $c): ?>
    <tr>
        <td><?= $c['course_code'] ?></td>
        <td><?= $c['course_name'] ?></td>
        <td><?= $c['credit_hours'] ?></td>
        <td>
            <a href="delete_course.php?id=<?= $c['id'] ?>">Delete</a>
            <a href="edit_course.php?id=<?= $c['id'] ?>">Edit</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>