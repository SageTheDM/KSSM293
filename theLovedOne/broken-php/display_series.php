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

// Select all data from the database
$sql = "SELECT * FROM series";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "Name: " . $row["name"] . "<br>Type: " . $row["type"] . "<br>Priority: " . $row["priority"] . "<br>Status: " . $row["status"] . "<br>Link: " . $row["link"] . "<br><br>";
    }
} else {
    echo "0 results";
}

// Close connection
$conn->close();
?>