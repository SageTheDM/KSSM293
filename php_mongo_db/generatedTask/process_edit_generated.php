<?php
$id = $_POST['id'];
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

require '../vendor/autoload.php'; // include Composer's autoloader
$client = new MongoDB\Client("mongodb://localhost:27017");
$collection = $client->sales->generated;

$collection->updateOne(['_id' => $id], ['$set' => $document]);

echo 'Der Eintrag wurde aktualisiert. <a href="generatedTask.php">Zurück</a>';
?>