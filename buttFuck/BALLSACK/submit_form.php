<?php
// Database connection parameters
$servername = "localhost";
$username = "patrick";
$password = "admin1234!";
$dbname = "patrick_series";

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
    $status = $_POST["status"]; // Get the status field
    $link = $_POST["link"];

    // Insert data into database
    $sql = "INSERT INTO series (name, type, priority, status, link) VALUES ('$name', '$type', '$priority', '$status', '$link')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";

        // Send email notification to info@photofuel.tech
        $to = "info@photofuel.tech";
        $subject = "New dataset submitted";
        $message = "A new dataset has been submitted:\n\nName: $name\nType: $type\nPriority: $priority\nStatus: $status\nLink: $link";
        $headers = "From: your_email@example.com" . "\r\n" .
            "Reply-To: your_email@example.com" . "\r\n" .
            "X-Mailer: PHP/" . phpversion();

        // Send email
        mail($to, $subject, $message, $headers);
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close connection
$conn->close();
?>