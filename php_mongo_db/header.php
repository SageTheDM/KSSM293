<?php
// #region Header
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'PHP Website'; ?></title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <header>
        <h1><?php echo $pageHeader ?? 'Welcome to PHP'; ?></h1>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="firstSteps.php">First Steps in PHP</a></li>
                <li><a href="task1.php">Task 1</a></li>
                <!-- Add other navigation links as needed -->
            </ul>
        </nav>
    </header>
    <main>