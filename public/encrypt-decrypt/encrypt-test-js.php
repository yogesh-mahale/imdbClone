<?php
$nonceValue = 'nonce_value';// use nonce that generated while using OAuth.

$readableString = 'bonzer@2017';
//$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiUm5LZ3VYMnd4QU1mNHlod2dPU2ltZz09IiwiaXYiOiJlODRkN2UzNGVlOGM4NzI1NzJkODkwNGMxYWRmNzEwNyIsInNhbHQiOiI1MGQ1MGI1MGI1Y2EzZDJjZmU4ZDVkZDQ4YTFkN2E3MGNhMWMwMjViYmJlOGZkNWY0Y2FhZDUxMGM4ODY3NzNiMzAwZDQ2ZTQxM2JlMjU2MGZlNDM2NTQ1YzBiNzNmNzE4MTY5M2VlNmJhZjc4ZGQ1MDE1MzU4OWRmM2NlODI2YzRjYzA0M2Q2NjRjMDQ0YzAyNDZlNzc1NGNkNGZhYjdjMmU1MjFhZjYwNDFiOWQ0ZmI1ZTM0OTg0MGQ1MWFiYmM1ZDk0MTU1YjMyZjQ1ZDBlN2RiYzYwOTVlMTljMGYzOWMxNjZkNDJlYmRkYjZhNGMwMTAwNDJmODI1MjE0MDI0MzViZGM5OTRkNDBiZjJiZWQ4ZGI0NWFjMDM5NTFjYzI2N2UxZmU1N2ZkNmZhMmEyZDZiMmJjZWEzZDA4OGYwZjIzZjI5ZmFlYzc5OTRjZTJlNDIyY2ExNGZlZjEzN2I3OGZjM2I4YzI5MjM1YmFiNGUzNWMxNGQwMzczZTEzMmUxNWU1ZTNlYTczNjEwZjc2NWQxMzFiYzg2M2NjOTRkMTdjMjkwNGE2OGY1YWUzYzk4YjNjOWY3MDg1M2RjODYxYTY3NjAzM2FiYWI1M2QzMjcwY2FhMDJmODNlYTk2ZTRkMzQ2ZTIwZTM3NDBmMjQ2M2YwNWMzOTdmNzAwZjRkNSIsIml0ZXJhdGlvbnMiOjk5OX0=';
$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiSDQ3QlQrTDlSSDVrNlhlQzFoNzMwUT09IiwiaXYiOiI2NmQzMjhmZTBhN2UwZDI1NzQ4NWY1NWQxNTlkNGM5ZSIsInNhbHQiOiI3MDA5ODQzZjQxYjI2NWVhNDkzNTU3ZDY2ZmYwYmJlOGQ0MmY0NTlkMjBmYWNlODM0ZDQ4ZTUxNDEzYzc3MDZkZTg2OWM1MGM4NTAzNzJiZDU3YzU5OGMzZjM2NGJhYTQzMjA4ODhmNTNjZmM2NzNkYTZkYjQ3NWE0MDNlMGEwY2Q0ODFlODdkZWU1MjZkN2FmYzY3MGI0NGVhODQ3MGFlZDlkMzY5MWQyZjNhNGFjMzZlNDEyNTQ4Zjg2OWNjM2M4ZDQ5MDc5OTk2M2RmMjcxY2ZhZTllYzcxNzMzYWViMzU0OTJmZDNmN2FmZGFhOTZhZGY4Y2NjOTIwNTFlOTNhZTU5NDg5NGY1YTllOTJjMWU1M2YyZTc0YTZiMmYzOWQwOTliZWNmN2RkN2IzNGI0MzdmN2RmODFiMDg5N2E2ZGFkNjNjYTQ1YzM4YjViNmU0ZGRiYmUyOGE5NzQzNTkyM2VhNjcxZTU3ZjY3MGQyZGNkYmY4ZGZhMGRlMTMwODE4ZTY1MjM4MTY4MWUwMGRmZDM0Yzc5MDc0MDZiMDA5YzYyNDkzMzQ4ZTU0NDAwYTllODc2MWU4MTA1NmNmY2JmYTZkZGNmODljZWNmNzA5YmY2OWI2YTJmMjFmZTE0YjMyMzk1NjU4ODYwZWI0OGYzODViZTZmYzBkM2QyZjg5NyIsIml0ZXJhdGlvbnMiOjk5OX0=';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
    	<div class="resultPlaceholder"></div>

        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <script src="crypto-js/crypto-js.js"></script><!-- https://github.com/brix/crypto-js/releases crypto-js.js can be download from here -->
        <script src="Encryption.js"></script>
        <script>
            var readableString = '<?php echo $readableString; ?>';
            var nonceValue = '<?php echo $nonceValue; ?>';
            var encryptedString = '<?php echo $encryptedString; ?>';

            // on page loaded.
            jQuery(document).ready(function($) {
                let encryption = new Encryption();
                /*var encrypted = encryption.encrypt(readableString, nonceValue);
                console.log(encrypted);

                var decrypted = encryption.decrypt(encrypted, nonceValue);
                console.log(decrypted);*/

                var decryptedOldString = encryption.decrypt(encryptedString, nonceValue);
                //console.log(decryptedOldString);

        	
                //$('.resultPlaceholder').html('readable string: '+readableString+'<br>');
                //$('.resultPlaceholder').append('encrypted: '+encrypted+'<br>');
                //$('.resultPlaceholder').append('decrypted: '+decrypted+'<br>');
                $('.resultPlaceholder').append('decrypted from old encrypted string: <strong>'+decryptedOldString+'</strong><br>');
            });
        </script>
    </body>
</html>