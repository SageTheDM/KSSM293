<?php
// Database connection parameters
$servername = "localhost:3306";
$username = "maria";
$password = "admin1234!"; // Replace ****** with your actual password
$dbname = "maria_series"; // Adjusted database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted and sanitize inputs
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Function to sanitize data
    function sanitize_data($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    // Get and sanitize form data
    $name = sanitize_data($_POST["name"]);
    $type = sanitize_data($_POST["type"]);
    $priority = sanitize_data($_POST["priority"]);
    $status = sanitize_data($_POST["status"]);
    $link = sanitize_data($_POST["link"]);
    $user = "patrick"; // Hardcoded user "patrick"

    // Prepare and bind parameters to prevent SQL injection
    $sql = "INSERT INTO series (name, type, priority, status, link, user) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssisss", $name, $type, $priority, $status, $link, $user);

    // Execute query
    if ($stmt->execute()) {
        echo "New record created successfully";

        // Send email notification to info@photofuel.tech
        $to = "info@photofuel.tech";
        $subject = "New dataset submitted";
        $message = "A new dataset has been submitted:\n\nName: $name\nType: $type\nPriority: $priority\nStatus: $status\nLink: $link\nUser: $user";
        $headers = "From: your_email@example.com" . "\r\n" .
            "Reply-To: your_email@example.com" . "\r\n" .
            "X-Mailer: PHP/" . phpversion();

        // Send email
        mail($to, $subject, $message, $headers);
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close statement
    $stmt->close();
}

// Close connection
$conn->close();
?>