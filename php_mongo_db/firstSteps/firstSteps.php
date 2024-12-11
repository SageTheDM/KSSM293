<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>First Steps in PHP</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <h1>First Steps in PHP</h1>
    <?php
    // Include Composer's autoloader
    require 'vendor/autoload.php';

    // Write a new MongoDB client
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // Select the database and collection
    $listingsCollection = $client->sample_airbnb->listingsAndReviews;
    $customersCollection = $client->sales->customers;

    // Find all documents in the listingsAndReviews collection
    // $listingsResults = $listingsCollection->find();
    
    // // Display each listing
    // foreach ($listingsResults as $document) {
    //     echo '<div class="objekt">';
    //     echo '<h3>' . $document['name'] . '</h3>';
    //     echo '<div class="price">Kosten pro Tag: ' . $document['price'] . ' $</div>';
    //     echo '</div>';
    // }
    
    // Example of inserting a new document
    // $document = array(
    //     "title" => "MongoDB",
    //     "description" => "database",
    //     "likes" => 100,
    //     "url" => "http://data.flair.training/mongodb/",
    //     "by" => "data flair"
    // );
    // $customersCollection->insertOne($document);
    
    // Example of displaying the 'last' field of each document
    // foreach ($listingsResults as $document) {
    //     echo '<h3>' . $document['last'] . '</h3>';
    // }
    
    // Update a document in the customers collection
    // $customersCollection->updateOne(
    //     array("name" => "MongoDB"),
    //     array(
    //         '$set' =>
    //             array("name" => "MongoDB Tutorial")
    //     )
    // );
    
    // Delete a document in the customers collection
    // $collection = $client->sales->customers;
    // $collection->deleteOne(
    //     array("title" => "MongoDb Tutorial")
    // );
    ?>
</body>

</html>