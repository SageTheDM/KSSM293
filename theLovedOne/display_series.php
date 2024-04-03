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

// Select data from database
$sql = "SELECT * FROM series";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "<ul>";
        echo "<li>Name: " . $row["name"] . "</li>";
        echo "<li>Movie/Series: " . $row["type"] . "</li>";
        echo "<li>Priority: " . $row["priority"] . "</li>";
        echo "<li>Link: <a href='" . $row["link"] . "'>" . $row["link"] . "</a></li>";
        echo "</ul>";
    }
} else {
    echo "0 results";
}

// Close connection
$conn->close();
?>
