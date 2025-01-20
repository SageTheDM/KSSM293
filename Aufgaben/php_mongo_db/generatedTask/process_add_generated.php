<?php
require '../vendor/autoload.php'; // include Composer's autoloader
$client = new MongoDB\Client("mongodb://localhost:27017");

$collection = $client->sales->generated;

$name = $_POST['name'];
$about = $_POST['about'];
$address = $_POST['address'];
$email = $_POST['email'];
$phone = $_POST['phone'];

$document = [
    'name' => $name,
    'about' => $about,
    'address' => $address,
    'email' => $email,
    'phone' => $phone
];

$result = $collection->insertOne($document);

if ($result->getInsertedCount() == 1) {
    echo "Eintrag erfolgreich erstellt.";
} else {
    echo "Fehler beim Erstellen des Eintrags.";
}
?>