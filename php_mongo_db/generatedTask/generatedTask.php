<?php
$pageTitle = 'Generated Collection';
$pageHeader = 'Generated Collection';
include '../header.php'; // header
?>


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'PHP Website'; ?></title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="generated.css">
</head>


<body>
    <h1>Generated Collection</h1>

    <!-- Task 2: Display All Documents -->
    <section>
        <h2>Task 2: All Documents</h2>
        <?php
        require_once '../vendor/autoload.php';

        // Create a connection to MongoDB
        $mongoClient = new MongoDB\Client("mongodb://localhost:27017");

        // Select the database and collection
        $database = $mongoClient->sales;
        $collection = $database->generated;

        // Retrieve all documents from the collection
        $documentsOne = $collection->find();

        echo '<ul>';
        foreach ($documentsOne as $document) {
            echo '<li>' . $document['name'] . '</li>';
        }
        echo '</ul>';
        ?>
    </section>

    <!-- Task 3: Insert a New Document -->
    <section>
        <h2>Task 3: Insert Sample Document</h2>
        <p>A new document was prepared but not inserted to prevent duplication.</p>
        <?php
        $document = [
            "name" => "John Doe",
            "age" => 30,
            "about" => "I am a sample document",
            "address" => [
                "street" => "123 Main Street",
                "city" => "Anytown",
                "zip" => "12345"
            ],
            "email" => "john.doe@example.com",
            "phone" => "+1 123 4567890",
            "eyeColor" => "blue",
            "isActive" => true
        ];

        // Uncomment to insert the document into the collection
        // $result = $collection->insertOne($document);
        ?>
    </section>

    <!-- Task 4: Filter Documents by Eye Color -->
    <section>
        <h2>Task 4: Filter by Eye Color (Blue)</h2>
        <?php
        $documentsTwo = $collection->find(["eyeColor" => "blue"]);

        echo '<ul>';
        foreach ($documentsTwo as $document) {
            echo '<li>' . $document['name'] . '</li>';
        }
        echo '</ul>';
        ?>
    </section>

    <!-- Task 5: Filter by Eye Color and Active Status -->
    <section>
        <h2>Task 5: Filter by Eye Color (Blue) and Active Status</h2>
        <?php
        $documentsThree = $collection->find([
            "eyeColor" => "blue",
            "isActive" => true
        ]);

        echo '<ul>';
        foreach ($documentsThree as $document) {
            echo '<li>' . $document['name'] . '</li>';
        }
        echo '</ul>';
        ?>
    </section>

    <!-- Task 6: Filter and Sort by Age -->
    <section>
        <h2>Task 6: Filter by Eye Color (Blue) and Sort by Age Descending</h2>
        <?php
        $documentsFour = $collection->find(["eyeColor" => "blue"], ['sort' => ['age' => -1]]);

        echo '<ul>';
        foreach ($documentsFour as $document) {
            echo '<li>' . $document['name'] . ' - ' . $document['age'] . '</li>';
        }
        echo '</ul>';
        ?>
    </section>

    <!-- Task 7: Image and h3 tags -->
    <section>
        <h2>Task 7: Image and h3 tags</h2>
        <?php
        $documentsFour = $collection->find(["eyeColor" => "blue"], ['sort' => ['age' => -1]]);
        foreach ($documentsFour as $document) {
            echo '<div class="person">';
            // Display the image that does not exist)
            // Failed to make it dynamic for over 10 min so not botter going further
            // if ($document['picture'] != null) {
            //     echo '<img src="' . $document['picture'] . '" alt="Image of ' . $document['name'] . '">';
            // } else {
            //     echo '<img src="https://via.placeholder.com/600" alt="Image of ' . $document['name'] . '">';
            // }
            // Display the name and age in h3 tag
            echo '<img src="https://via.placeholder.com/600" alt="Image of ' . $document['name'] . '">';
            echo '<h3>' . $document['name'] . ' (' . $document['age'] . ')</h3>';
            echo '</div>';
        }
        ?>
    </section>

    <!-- Task 8: About and other attributes -->
    <section>
        <h2>Task 8: Display Cards</h2>
        <?php
        // Assuming you're retrieving documents with the structure you provided
        $documentsFour = $collection->find(["eyeColor" => "blue"], ['sort' => ['age' => -1]]);
        foreach ($documentsFour as $document) {
            echo '<div class="person">';

            // Display the image
            echo '<img src="https://via.placeholder.com/600" alt="Image of ' . $document['name'] . '">';

            // Display the name and age in h3 tag
            echo '<h3>' . $document['name'] . ' (' . $document['age'] . ')</h3>';

            // Display the "about" attribute
            echo '<div class="about">';
            echo '<p>' . $document['about'] . '</p>';
            echo '</div>';

            // Display address
            echo '<div class="address">';
            echo '<h4>Address</h4>';
            echo '<p>' . $document['address'] . '</p>';
            echo '</div>';

            // Display email
            echo '<div class="email">';
            echo '<h4>Email</h4>';
            echo '<p>' . $document['email'] . '</p>';
            echo '</div>';

            // Display phone
            echo '<div class="phone">';
            echo '<h4>Phone</h4>';
            echo '<p>' . $document['phone'] . '</p>';
            echo '</div>';

            // Display eyeColor
            echo '<div class="eyeColor">';
            echo '<h4>Eye Color</h4>';
            echo '<p>' . $document['eyeColor'] . '</p>';
            echo '</div>';

            echo '</div>';
        }
        ?>
    </section>

    <!-- Task 10: Display Persons in a Grid -->
    <section>
        <h2>Task 10: Grid Layout</h2>
        <div class="grid-wrapper">
            <?php
            // Assuming you're retrieving documents with the structure you provided
            $documentsFour = $collection->find(["eyeColor" => "blue"], ['sort' => ['age' => -1]]);
            foreach ($documentsFour as $document) {
                echo '<div class="person">';

                // Display the image
                echo '<img src="https://via.placeholder.com/600" alt="Image of ' . $document['name'] . '">';

                // Display the name and age in h3 tag
                echo '<h3>' . $document['name'] . ' (' . $document['age'] . ')</h3>';

                // Display the "about" attribute
                echo '<div class="about">';
                echo '<p>' . $document['about'] . '</p>';
                echo '</div>';

                echo '</div>';
            }
            ?>
        </div>
    </section>


</body>

<?php include '../footer.php'; // footer ?>