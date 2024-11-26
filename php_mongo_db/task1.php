<?php
// Include MongoDB client library
require 'vendor/autoload.php'; // Ensure to install MongoDB PHP Library via Composer

use MongoDB\Client;

// MongoDB connection
$client = new Client("mongodb://localhost:27017");
$database = $client->selectDatabase('your_database_name');
$collection = $database->selectCollection('your_new_collection_name');

// Function to fetch and display the collection as a table
function displayCollection($collection)
{
    $documents = $collection->find();
    ob_start(); // Start output buffering
    ?>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($documents as $doc): ?>
                <tr>
                    <td><?= htmlspecialchars($doc['name'] ?? 'N/A') ?></td>
                    <td><?= htmlspecialchars($doc['description'] ?? 'N/A') ?></td>
                    <td><?= htmlspecialchars($doc['status'] ?? 'N/A') ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php
    return ob_get_clean(); // Return the buffered content
}

// Task Outputs
$tasksOutput = [];

// Task 1: Create a new collection (Implicitly created when documents are inserted)
$task1Code = <<<'CODE'
$client = new Client("mongodb://localhost:27017");
$database = $client->selectDatabase('your_database_name');
$collection = $database->selectCollection('your_new_collection_name');
CODE;

$tasksOutput[] = [
    'title' => 'Task 1: Create a New Collection',
    'code' => $task1Code,
    'output' => "The collection is created implicitly when documents are added.",
    'table' => displayCollection($collection)
];

// Task 2: Add Two New Documents
$task2Code = <<<'CODE'
$document1 = ['name' => 'Document 1', 'description' => 'First document in the collection.'];
$document2 = ['name' => 'Document 2', 'description' => 'Second document in the collection.'];
$collection->insertMany([$document1, $document2]);
CODE;

$collection->insertMany([
    ['name' => 'Document 1', 'description' => 'First document in the collection.'],
    ['name' => 'Document 2', 'description' => 'Second document in the collection.']
]);

$tasksOutput[] = [
    'title' => 'Task 2: Add Two New Documents',
    'code' => $task2Code,
    'output' => "Two documents were added successfully.",
    'table' => displayCollection($collection)
];

// Task 3: Update Two Documents
$task3Code = <<<'CODE'
// Update a field
$collection->updateOne(
    ['name' => 'Document 1'],
    ['$set' => ['description' => 'Updated description for Document 1']]
);

// Add a new field
$collection->updateOne(
    ['name' => 'Document 2'],
    ['$set' => ['status' => 'Active']]
);
CODE;

$collection->updateOne(
    ['name' => 'Document 1'],
    ['$set' => ['description' => 'Updated description for Document 1']]
);
$collection->updateOne(
    ['name' => 'Document 2'],
    ['$set' => ['status' => 'Active']]
);

$tasksOutput[] = [
    'title' => 'Task 3: Update Two Documents',
    'code' => $task3Code,
    'output' => "Two documents were updated successfully.",
    'table' => displayCollection($collection)
];
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

    <?php foreach ($tasksOutput as $task): ?>
        <div class="task">
            <h3><?= $task['title'] ?></h3>
            <div class="code-block">
                <?= nl2br(htmlspecialchars($task['code'])) ?>
            </div>
            <p><strong>Output:</strong> <?= $task['output'] ?></p>
            <?= $task['table'] ?>
        </div>
    <?php endforeach; ?>
</body>

</html>