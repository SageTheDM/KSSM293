<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <title>Document</title>
</head>

<body>
    <div class="container">
        <h1>Eintrag bearbeiten</h1>

        <?php
        $id = $_GET['id'];
        //echo $id;
        
        require '../vendor/autoload.php'; // include Composer's autoloader
        $client = new MongoDB\Client("mongodb://localhost:27017");

        $collection = $client->sales->generated;
        $results = $collection->find(['_id' => $id]);

        foreach ($results as $document) {
            $name = $document->name;
        }
        ?>

        <form action="process_edit_generated.php" method="post">

            <div class="input-field">
                <input type="text" name="name" value="<?php echo $name ?>">
                <label>Name</label>
            </div>

            <div>
                <input type="submit" value="Speichern" class="btn">
            </div>

        </form>
    </div>
</body>

</html>