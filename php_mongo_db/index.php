<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php
    $author = "jon doe";
    echo "<h1>Hello World</h1>
    <p>This is dynamic web page was created by $author.</p>";
    ?>
    <?php
    require 'vendor/autoload.php'; // include Composer's autoloader
    $client = new MongoDB\Client("mongodb://localhost:27017");

    //TODO
    ?>
</body>

</html>