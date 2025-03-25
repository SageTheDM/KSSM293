<?php
require '../vendor/autoload.php';

use MongoDB\Client;

// MongoDB connection
$client = new Client("mongodb://localhost:27017");
$database = $client->selectDatabase('sales');
$collection = $database->selectCollection('restaurant');

// Fetch all documents from the collection
$results = $collection->find();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP MongoDB Tasks</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <h1>Restaurant-Datenbank</h1>
    <div class="container">
        <?php foreach ($results as $restaurant):
            $coord = $restaurant['address']['coord'] ?? null;
            $latitude = $coord[1] ?? null;
            $longitude = $coord[0] ?? null;
            $googleMapsLink = $latitude && $longitude
                ? "http://maps.google.com/maps?q=$latitude,$longitude"
                : null;

            // Convert BSONArray to a PHP array
            $grades = $restaurant['grades'] ?? [];
            $gradesArray = iterator_to_array($grades); // Convert BSONArray to a PHP array
            $averageGrade = count($gradesArray) > 0 ? array_sum(array_column($gradesArray, 'score')) / count($gradesArray) : 0;
            ?>
            <div class="table">
                <h3><?php echo htmlspecialchars($restaurant['name'] ?? 'Unbekannt'); ?></h3>
                <div>
                    <label>Street:</label>
                    <?php if ($googleMapsLink): ?>
                        <p>
                            <a href="<?php echo $googleMapsLink; ?>" target="_blank">
                                <?php echo htmlspecialchars($restaurant['address']['street'] ?? 'N/A'); ?>
                                <?php echo htmlspecialchars($restaurant['address']['building'] ?? ''); ?>
                            </a>
                        </p>
                    <?php else: ?>
                        <p><?php echo htmlspecialchars($restaurant['address']['street'] ?? 'N/A'); ?>
                            <?php echo htmlspecialchars($restaurant['address']['building'] ?? ''); ?>
                        </p>
                    <?php endif; ?>
                </div>
                <div>
                    <label>Zipcode:</label>
                    <p><?php echo htmlspecialchars($restaurant['address']['zipcode'] ?? 'N/A'); ?></p>
                </div>
                <div>
                    <label>Borough:</label>
                    <p><?php echo htmlspecialchars($restaurant['borough'] ?? 'N/A'); ?></p>
                </div>
                <div>
                    <label>Cuisine:</label>
                    <p><?php echo htmlspecialchars($restaurant['cuisine'] ?? 'N/A'); ?></p>
                </div>
                <div>
                    <label>Rating:</label>
                    <p>
                        <?php
                        // Display stars based on the average grade
                        for ($i = 0; $i < $averageGrade; $i++) {
                            echo '⭐';
                        }
                        ?>
                    </p>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</body>

</html>