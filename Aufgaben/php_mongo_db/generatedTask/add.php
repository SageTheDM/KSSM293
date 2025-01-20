<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <title>Neuer Eintrag</title>
</head>

<body>
    <div class="container">
        <h1>Neuer Eintrag</h1>

        <form action="process_add_generated.php" method="post">

            <div class="input-field">
                <input type="text" name="name" value="">
                <label>Name</label>
            </div>

            <div class="input-field">
                <textarea name="about" class="materialize-textarea"></textarea>
                <label>About</label>
            </div>

            <div class="input-field">
                <input type="text" name="address" value="">
                <label>Address</label>
            </div>

            <div class="input-field">
                <input type="text" name="email" value="">
                <label>E-Mail</label>
            </div>

            <div class="input-field">
                <input type="text" name="phone" value="">
                <label>Phone</label>
            </div>

            <div>
                <input type="submit" value="Speichern" class="btn">
            </div>

        </form>
    </div>
</body>

</html>