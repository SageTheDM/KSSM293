<?php
$pageTitle = 'Welcome to PHP';
$pageHeader = 'Welcome to PHP';
include 'header.php'; // Include the common header
?>

<section>
    <h2>Welcome to the PHP Example Website</h2>
    <nav>
        <ul class="coolCard">
            <li><a href="firstSteps/firstSteps.php">First Steps in PHP</a></li>
            <li><a href="taskOne/task1.php">Task 1</a></li>
            <li><a href="generatedTask/generatedTask.php">Generated Task</a></li>
            <!-- Add other navigation links as needed -->
        </ul>
    </nav>
</section>

<?php include 'footer.php'; // Include the common footer ?>
