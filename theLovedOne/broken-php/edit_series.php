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

// Check if ID parameter is provided
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Fetch series details from the database based on ID
    $sql = "SELECT * FROM series WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Display form for editing series details
        $row = $result->fetch_assoc();
        ?>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Edit Series</title>
            <link rel="stylesheet" href="styles.css">
        </head>

        <body>
            <div class="edit-form">
                <h2>Edit Series Details</h2>
                <form action="update_series.php" method="post">
                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" value="<?php echo $row['name']; ?>" required><br>
                    <label for="type">Movie/Series:</label>
                    <select id="type" name="type">
                        <option value="Movie" <?php if ($row['type'] == 'Movie')
                            echo 'selected'; ?>>Movie</option>
                        <option value="Series" <?php if ($row['type'] == 'Series')
                            echo 'selected'; ?>>Series</option>
                    </select><br>
                    <label for="priority">Priority:</label>
                    <select id="priority" name="priority">
                        <option value="High" <?php if ($row['priority'] == 'High')
                            echo 'selected'; ?>>High</option>
                        <option value="Medium" <?php if ($row['priority'] == 'Medium')
                            echo 'selected'; ?>>Medium</option>
                        <option value="Low" <?php if ($row['priority'] == 'Low')
                            echo 'selected'; ?>>Low</option>
                    </select><br>
                    <label for="status">Status:</label>
                    <select id="status" name="status">
                        <option value="Not Watched" <?php if ($row['status'] == 'Not Watched')
                            echo 'selected'; ?>>Not Watched
                        </option>
                        <option value="Watched" <?php if ($row['status'] == 'Watched')
                            echo 'selected'; ?>>Watched</option>
                        <option value="Currently Watching" <?php if ($row['status'] == 'Currently Watching')
                            echo 'selected'; ?>>
                            Currently Watching</option>
                    </select><br>
                    <label for="link">Link (optional):</label>
                    <input type="text" id="link" name="link" value="<?php echo $row['link']; ?>"><br>
                    <input type="submit" value="Update">
                </form>
            </div>
        </body>

        </html>
        <?php
    } else {
        echo "Series not found.";
    }
} else {
    echo "Series ID not provided.";
}
// Close connection
$conn->close();
?>