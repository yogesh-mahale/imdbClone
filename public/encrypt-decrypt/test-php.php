<?php
require 'Encryption.php';

$nonceValue = null;// use nonce that generated while using OAuth.

$readableString = 'bonzer@2017';
//$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiUm5LZ3VYMnd4QU1mNHlod2dPU2ltZz09IiwiaXYiOiJlODRkN2UzNGVlOGM4NzI1NzJkODkwNGMxYWRmNzEwNyIsInNhbHQiOiI1MGQ1MGI1MGI1Y2EzZDJjZmU4ZDVkZDQ4YTFkN2E3MGNhMWMwMjViYmJlOGZkNWY0Y2FhZDUxMGM4ODY3NzNiMzAwZDQ2ZTQxM2JlMjU2MGZlNDM2NTQ1YzBiNzNmNzE4MTY5M2VlNmJhZjc4ZGQ1MDE1MzU4OWRmM2NlODI2YzRjYzA0M2Q2NjRjMDQ0YzAyNDZlNzc1NGNkNGZhYjdjMmU1MjFhZjYwNDFiOWQ0ZmI1ZTM0OTg0MGQ1MWFiYmM1ZDk0MTU1YjMyZjQ1ZDBlN2RiYzYwOTVlMTljMGYzOWMxNjZkNDJlYmRkYjZhNGMwMTAwNDJmODI1MjE0MDI0MzViZGM5OTRkNDBiZjJiZWQ4ZGI0NWFjMDM5NTFjYzI2N2UxZmU1N2ZkNmZhMmEyZDZiMmJjZWEzZDA4OGYwZjIzZjI5ZmFlYzc5OTRjZTJlNDIyY2ExNGZlZjEzN2I3OGZjM2I4YzI5MjM1YmFiNGUzNWMxNGQwMzczZTEzMmUxNWU1ZTNlYTczNjEwZjc2NWQxMzFiYzg2M2NjOTRkMTdjMjkwNGE2OGY1YWUzYzk4YjNjOWY3MDg1M2RjODYxYTY3NjAzM2FiYWI1M2QzMjcwY2FhMDJmODNlYTk2ZTRkMzQ2ZTIwZTM3NDBmMjQ2M2YwNWMzOTdmNzAwZjRkNSIsIml0ZXJhdGlvbnMiOjk5OX0=';
$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiIiwiaXYiOiIiLCJzYWx0IjoiOWY4MGNiYTQ1NmE1MGIyMTExMDUxODdiNWRmMTIxN2NkOGExY2RiMWQ3MjU5ZWQ5N2UxMDYzYmZiODc5MGRlZGY0NjY3YWZlNzE0NWQ3NTYxY2ZjYWVlYzEyYjViZmJlMGY1YTU0OGMzNjczNzhlYzdjYTY5ZDg4NTc0ODMyMmRjNzc5NTMwODJmZjdmNGEwNDc2NTNhNDAzOTU3YzNlMzVhNjhkY2NmNzUwNDMxZWI3OGI3YTkyMGYxMDZmODY4MGE0M2QwY2ExYWFjZTkyOGYwMDdhMWRhNDJkZDk3MTRiYTRiMDhmNTRhZTE0YWFjMjdhYzE2NTdkZTQxMzQ2YjY5ODcyNjI2NjRhNTcwZGZmNTJjMThlZDM3ZTdjMGExOGMwMzBhMzU2NjNkODQxZTE4Nzk3OTg4N2RlODczZTg3ZmU4NzM3MjhlMzA5YjMzNWJlM2Q2NzI0MTYxZTBlMDg4MTM5NDhmYTFkYTczY2NkZDJhMjEwZjNkOGMxZWQzOGRmY2MxMDNiZWZhZjc0ZWE0NWMzOTIwYjAyYjQ5MGViNmEzMmNmMGI3OWI4MWIyYjcyM2ZkOTM3NmZkNmNjOTVjYzg5MTY4NWM0ZTI5MjE3YmQ0Y2RiYjc0YWExZjY5OTk4ZmEyNDA5NWQ5NjI1NjY5MjVmYTZjY2U1ZWFkNDgifQ==';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?php 
        echo 'readable string: ' . $readableString . '<br>';
        $Encryption = new Encryption();
        $encrypted = $Encryption->encrypt($readableString, $nonceValue);
        echo 'encrypted: ' . $encrypted . '<br>';
        
        echo "\n\n\n";
        echo '<hr>';
        echo "\n\n\n";
        
        $decrypted = $Encryption->decrypt($encrypted, $nonceValue);
        echo 'decrypted: ' . $decrypted . '<br>';
        $decrypted = $Encryption->decrypt($encryptedString, $nonceValue);
        echo 'decrypted from old encrypted string: <strong>' . $decrypted . '</strong><br>';
        ?>
	</body>
</html>