<?php
// Database connection parameters
$servername = "localhost";
$username = "maria";
$password = "admin1234!";
$dbname = "maria_series";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST["name"];
    $type = $_POST["type"];
    $priority = $_POST["priority"];
    $link = $_POST["link"];

    // Insert data into database
    $sql = "INSERT INTO series (name, type, priority, link) VALUES ('$name', '$type', '$priority', '$link')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close connection
$conn->close();
?>
