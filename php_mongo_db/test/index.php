<?php
require '../vendor/autoload.php';

use MongoDB\Client;

// MongoDB connection
$client = new Client("mongodb://localhost:27017");
$database = $client->selectDatabase('sales');
$collection = $database->selectCollection('movies');
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
    <h1>PHP MongoDB Task Execution</h1>

    <?php

    $documents = $collection->find();
    foreach ($documents as $document) {
        if ($document['year'] >= 2000) {
            echo '<h3>' . $document['title'] . ' (' . $document['rate'] . '<span>⭐</span>' . ')' . '</h3>';
            echo '<p>' . $document['duration'] . '</p>';
            echo '<p>' . $document['year'] . '</p>';
            echo '<a href=""' . "https://de.wikipedia.org/wiki/" . $document['director'] . '>' . $document['director'] . '</a>'; // did not mange to replace " " with _ in time
            // genre not working 
        }
    }
    ?>
    <?php
    $document = [
        "tile" => "PHP the exam",
        "year" => 30,
        "director" => "I am a sample document",
        "duration" => "2h 15min",
        "genre" => ['Fantasy', 'Crime'],
        "actors" => ['John Doe', 'Tim Karl', 'Helene Fischer']
    ];

    $collection->insertOne($document);
    ?>

</body>

</html>