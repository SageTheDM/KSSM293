<?php
require '../vendor/autoload.php';

use MongoDB\Client;

$client = new Client("mongodb://localhost:27017");
$database = $client->selectDatabase('sales');
$collection = $database->selectCollection('restaurant');

$updateResult = $collection->updateOne(
    ["name" => "Pasta Palace"],
    ['$set' => ['cuisine' => 'Typical Swiss']]
);

if ($updateResult->getModifiedCount() > 0) {
    echo "Die Küche von 'Pasta Palace' wurde erfolgreich auf 'Typical Swiss' geändert.";
} else {
    echo "Keine Änderungen vorgenommen.";
}
?>