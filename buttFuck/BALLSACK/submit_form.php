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
    // Validate and sanitize form data
    $description = mysqli_real_escape_string($conn, $_POST["description"]);
    $category = mysqli_real_escape_string($conn, $_POST["category"]);
    $version = mysqli_real_escape_string($conn, $_POST["version"]);
    $notes = mysqli_real_escape_string($conn, $_POST["notes"]);

    // Insert data into database using prepared statements
    $sql = "INSERT INTO series (description, category, version, notes) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $description, $category, $version, $notes);

    if ($stmt->execute()) {
        echo "New record created successfully";

        // Send email notification
        $to = "info@photofuel.tech";
        $subject = "New dataset submitted";
        $message = "A new dataset has been submitted:\n\nDescription: $description\nCategory: $category\nVersion: $version\nNotes: $notes";
        $headers = "From: your_email@example.com" . "\r\n" .
            "Reply-To: your_email@example.com" . "\r\n" .
            "X-Mailer: PHP/" . phpversion();

        // Send email
        $mail_success = mail($to, $subject, $message, $headers);
        if (!$mail_success) {
            echo "Failed to send email notification.";
        }
    } else {
        echo "Error: Failed to insert record into database.";
    }
    $stmt->close();
}

// Close connection
$conn->close();
?>