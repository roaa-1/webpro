<?php
session_start();

require_once "../config/db.php";
require_once "../models/Course.php";

/* AUTH CHECK */
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die("Access denied");
}

$course = new Course($conn);

/* ADD COURSE */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add'])) {

    $code  = trim($_POST['code']);
    $name  = trim($_POST['name']);
    $hours = (int) $_POST['hours'];
    $desc  = trim($_POST['desc']);

    if (!empty($code) && !empty($name) && $hours > 0) {

        $course->add($code, $name, $hours, $desc);

        $success = "Course added successfully.";
    } else {
        $error = "Please fill all fields.";
    }
}

/* DELETE */
if (isset($_GET['delete'])) {

    $id = (int) $_GET['delete'];

    if ($id > 0) {
        $course->delete($id);
        $success = "Course deleted successfully.";
    }
}

$courses = $course->getAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Manage Courses</title>

<link rel="stylesheet" href="../assets/css/manageCourses.css">

</head>
<body>

<div class="container">

    <h2>Manage Courses</h2>

    <?php if(isset($success)): ?>
        <div class="success-msg">
            <?= $success ?>
        </div>
    <?php endif; ?>

    <?php if(isset($error)): ?>
        <div class="error-msg">
            <?= $error ?>
        </div>
    <?php endif; ?>

    <!-- ADD FORM -->
    <form method="POST">

        <input type="text"
               name="code"
               placeholder="Course Code"
               required>

        <input type="text"
               name="name"
               placeholder="Course Name"
               required>

        <input type="number"
               name="hours"
               placeholder="Credit Hours"
               required>

        <textarea name="desc"
                  placeholder="Description"></textarea>

        <button type="submit" name="add">
            Add Course
        </button>

    </form>

    <!-- COURSES TABLE -->
    <table>

        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Hours</th>
            <th>Actions</th>
        </tr>

        <?php foreach ($courses as $c): ?>

        <tr>

            <td><?= htmlspecialchars($c['course_code']) ?></td>

            <td><?= htmlspecialchars($c['course_name']) ?></td>

            <td><?= htmlspecialchars($c['credit_hours']) ?></td>

            <td>

                <a href="edit_course.php?id=<?= $c['id'] ?>">
                    Edit
                </a>

                <a href="manage_courses.php?delete=<?= $c['id'] ?>"
                   onclick="return confirm('Delete this course?')">
                    Delete
                </a>

            </td>

        </tr>

        <?php endforeach; ?>

    </table>

</div>

</body>
</html>