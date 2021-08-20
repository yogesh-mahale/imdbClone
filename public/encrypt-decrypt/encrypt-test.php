<?php
error_reporting(1);

$readableString = 'bonzer@2017';

//$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiIiwiaXYiOiIiLCJzYWx0IjoiOWY4MGNiYTQ1NmE1MGIyMTExMDUxODdiNWRmMTIxN2NkOGExY2RiMWQ3MjU5ZWQ5N2UxMDYzYmZiODc5MGRlZGY0NjY3YWZlNzE0NWQ3NTYxY2ZjYWVlYzEyYjViZmJlMGY1YTU0OGMzNjczNzhlYzdjYTY5ZDg4NTc0ODMyMmRjNzc5NTMwODJmZjdmNGEwNDc2NTNhNDAzOTU3YzNlMzVhNjhkY2NmNzUwNDMxZWI3OGI3YTkyMGYxMDZmODY4MGE0M2QwY2ExYWFjZTkyOGYwMDdhMWRhNDJkZDk3MTRiYTRiMDhmNTRhZTE0YWFjMjdhYzE2NTdkZTQxMzQ2YjY5ODcyNjI2NjRhNTcwZGZmNTJjMThlZDM3ZTdjMGExOGMwMzBhMzU2NjNkODQxZTE4Nzk3OTg4N2RlODczZTg3ZmU4NzM3MjhlMzA5YjMzNWJlM2Q2NzI0MTYxZTBlMDg4MTM5NDhmYTFkYTczY2NkZDJhMjEwZjNkOGMxZWQzOGRmY2MxMDNiZWZhZjc0ZWE0NWMzOTIwYjAyYjQ5MGViNmEzMmNmMGI3OWI4MWIyYjcyM2ZkOTM3NmZkNmNjOTVjYzg5MTY4NWM0ZTI5MjE3YmQ0Y2RiYjc0YWExZjY5OTk4ZmEyNDA5NWQ5NjI1NjY5MjVmYTZjY2U1ZWFkNDgifQ==';
//$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiIiwiaXYiOiIiLCJzYWx0IjoiYWE5NThhZmE5NjE3MjY1NzdjNmJmM2IzZDZmODRmZmY5MTBlMzc4M2M4YmE2OTQ1YTJhZTljOWQwYTZlMGE3YTk0Y2UwNGZlNTdjODkzYmNhNDJmZDBjODA3MDBkYzZhZDUyYWZiM2Y1ZDI4YjYzM2RlNzQ3NDI2ODg5NTk3ZDNjNTVjZmIwYzViNjkzZmY4ZmY3YmIzNjY3ZmUyOGRjMWUwYzk3NzYyYjM4MTE1Yjc4NTljMDdkODQ4ODY5ZGE1NDFkOGZiZTRjYTEzYTYyNTcyMzhlNDk5MTYxNGFhNGJhNDFjMTIzMzI4MGJhNzM4MWFkZWE1MmVlZWU3NGY4ZTc3NWQwOWEyMzFkMDE2ODE1MzQ4Mjk2NmVlMzc3YmM1OGNjNGIzNmI0NTFmNzc2ZmU0NDg4YWVjZGQzZTZhZGUzYmZmMWUzYmRhMmJjNTVhZjk3YmY4MGE2ZDQwZjk0ZThkYWRhOTUzNTMwNmNjYzJkOGQ3Yjc0OTNjZWIwOTA1N2QzNmI0YjA2MDNiZDk4OTVkNzA1YjU4MzZiODRlYTg4ZjcxZTJjNjU1MGM1NTdiZTliZWU4YzU0NjU1NTdkODBhMTIyNThjNDdmMzdmMGM2ZGNmMGJiMDliN2ZkNjg0YTZjNTMwZDM1NGYzYjU1YWQ0MTkzNDg4MjNiMTZjNzYifQ==';
$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiMTg0VUhiQ1ZIZ3hkQXgyUVJDTGNyQT09IiwiaXYiOiJlMTYwMzExMGY3YTc0OTRhN2E3MDhhZTEzMWJmNWJiNSIsInNhbHQiOiI0NWFlZjg3NDQ5ZGZhNGQ1NDQ4YjYyMTZkYmNjMDJkYTkyYWUyMjdkYmMwOWExZDk5M2M3MDNhODQ2NTQ4ZmJlNmM1ZmUxNTU3MzU4YzA3ZjEyOTljZDczMWEwYTY2ZTBkM2UxOWEzYjdjYjhkYTQ4YWYwOWFiNzU0YjlmNWMzMGEzNWJlMjYwMjJkMGE2Mjg0ZTk2MDhkNzdlZDJmNjU0NTRhZDk1ZmQ4NjNjNGE2NTAyMWVhZGY1ZDE4MGNkMzdjOTdhYjE0MTQwMjNjNzMwZjY3M2Q2NDE5ZDNmNWI1MzllYWFmNjQ4ODJiYjExNmMzMTM3YjUyZGFiMDhjNmE2MDQ5ZDdmZjRiMzJjMzMxNzVhMjIyNjMxNzI5YzVhNmMyMzNjMTRlNDgzYzdkODdiMDUxZmZmZGZmMTM3YjVmYzNiNDk3MzViZWQyODIyZDQxY2Y4OTliODZjOTkwYTFlNGVmNDk2NDAzOTQ4ZDg4ZDljYjFmMDRhYTQzZGJjNGM5YmE1MjlkODg3NmMzNGE2MmIwNWMxZWVjY2MzYjZhY2Y5N2JjZmY1ZTBhNzFmNjEzY2I1MDBlYjE0YmM2NWE3NjVmM2Q2NWM2MWYxNmMxMTA1MmFiYjhmYjQyZGE2OTVhZDFkMzkzOWQ3NmM1NzhjYjExNDRjMmQyNzgxNGM1MSJ9';

define('iterations', 999);
//define('encryptKey', 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36');
define('encryptKey', 'psdyBzfgzUIvXZFShJuikaWvLJhIVq36');


function encrypt($string)
{
    $encryptMethod = 'AES-256-CBC';
    $encryptMethodLength = intval(abs(filter_var($encryptMethod, FILTER_SANITIZE_NUMBER_INT)));
    $ivLength = openssl_cipher_iv_length($encryptMethod);
    $iv = openssl_random_pseudo_bytes($ivLength);

    $salt = openssl_random_pseudo_bytes(256);

    $hashKey = hash_pbkdf2('sha512', encryptKey, $salt, iterations, ($encryptMethodLength/4));

    $encryptedString = openssl_encrypt($string, $encryptMethod, hex2bin($hashKey), OPENSSL_RAW_DATA, $iv);

    $encryptedString = base64_encode($encryptedString);
    unset($hashKey);

    $output = ['ciphertext' => $encryptedString, 'iv' => bin2hex($iv), 'salt' => bin2hex($salt)];
    unset($encryptedString, $iv, $ivLength, $salt);

    return base64_encode(json_encode($output));
}// encrypt

function decrypt($encryptedString)
{
    $encryptMethod = 'AES-256-CBC';
    $encryptMethodLength = intval(abs(filter_var($encryptMethod, FILTER_SANITIZE_NUMBER_INT)));

    $json = json_decode(base64_decode($encryptedString), true);

    try {
        $salt = hex2bin($json["salt"]);
        $iv = hex2bin($json["iv"]);
    } catch (Exception $e) {
        return null;
    }

    $cipherText = base64_decode($json['ciphertext']);

    $hashKey = hash_pbkdf2('sha512', encryptKey, $salt, iterations, ($encryptMethodLength / 4));
    unset($json, $salt);

    $decrypted= openssl_decrypt($cipherText , $encryptMethod, hex2bin($hashKey), OPENSSL_RAW_DATA, $iv);
    unset($cipherText, $hashKey, $iv);

    return $decrypted;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <script src="crypto-js/crypto-js.js"></script>
    </head>
    <body>
        <?php
            echo 'PHP: readable string: ' . $readableString . '<br>';
            $encrypted = encrypt($readableString);
            echo 'PHP: encrypted: ' . $encrypted . '<br>';

            echo "\n\n\n";
            echo '<hr>';
            echo "\n\n\n";

            $decrypted = decrypt($encrypted);
            echo 'PHP: decrypted: ' . $decrypted . '<br>';
        ?>

        <div class="resultPlaceholder"></div>
        <script src="Encryption.js"></script>
        <script>
            var readableString = '<?php echo $readableString; ?>';
            //var encryptedString = '<?php echo $encrypted; ?>';
            var encryptedString = '<?php echo $encryptedString; ?>';

            var encryptMethod = 'AES-256-CBC',
                iterations = 999,
                //encryptKey = 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36';
                encryptKey = 'psdyBzfgzUIvXZFShJuikaWvLJhIVq36';

            var decrypt = function(encryptedString) {
                var json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString))),
                    iv = CryptoJS.enc.Hex.parse(json.iv),
                    salt = CryptoJS.enc.Hex.parse(json.salt),
                    encrypted = json.ciphertext,// no need to base64 decode.
                    encryptMethodLength = (parseInt(encryptMethod.match(/\d+/)[0])/4);// example: AES number is 256 / 4 = 64

                var hashKey = CryptoJS.PBKDF2(encryptKey,
                    salt,
                    {
                        'hasher': CryptoJS.algo.SHA512,
                        'keySize': (encryptMethodLength/8),
                        'iterations': iterations
                    });

                var decrypted = CryptoJS.AES.decrypt(encrypted,
                    hashKey,
                    {
                        'mode': CryptoJS.mode.CBC,
                        'iv': iv
                    });

                return decrypted.toString(CryptoJS.enc.Utf8);
            }// decrypt

            var encrypt = function(string) {
                var iv = CryptoJS.lib.WordArray.random(16), // encryptMethod support 16
                    salt = CryptoJS.lib.WordArray.random(256),
                    encryptMethodLength = (parseInt(encryptMethod.match(/\d+/)[0])/4); // example: AES number is 256 / 4 = 64;

                var hashKey = CryptoJS.PBKDF2(encryptKey,
                    salt,
                    {
                        'hasher': CryptoJS.algo.SHA512,
                        'keySize': (encryptMethodLength/8),
                        'iterations': iterations
                    });

                var encrypted = CryptoJS.AES.encrypt(string,
                    hashKey,
                    {
                        'mode': CryptoJS.mode.CBC,
                        'iv': iv
                    });

                var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

                var output = {
                    'ciphertext': encryptedString,
                    'iv': CryptoJS.enc.Hex.stringify(iv),
                    'salt': CryptoJS.enc.Hex.stringify(salt)
                };

                return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output)));
            };


            /*var encrypt = function(string, key) {
                //var iv = CryptoJS.lib.WordArray.random(16);// the reason to be 16, please read on `encryptMethod` property.
                var iv = CryptoJS.enc.Utf8.parse(iv);// the reason to be 16, please read on `encryptMethod` property.

                //var salt = CryptoJS.lib.WordArray.random(256);
                var salt = CryptoJS.enc.Utf8.parse(salt);

                //var iterations = 999;

                var encryptMethodLength = (256/4);// example: AES number is 256 / 4 = 64
                var hashKey = CryptoJS.PBKDF2(key, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength/8), 'iterations': iterations});

                var encrypted = CryptoJS.AES.encrypt(string, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});
                var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

                var output = {
                    'ciphertext': encryptedString,
                    'iv': CryptoJS.enc.Hex.stringify(iv),
                    'salt': CryptoJS.enc.Hex.stringify(salt),
                    'iterations': iterations
                };

                return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output)));
            }// encrypt*/

            jQuery(document).ready(function($) {
                var encrypted = encrypt(readableString);

                var decrypted = decrypt(encryptedString);
                //console.log(decrypted);

                /*let encryption = new Encryption();
                var encrypted = encryption.encrypt(readableString, nonceValue);
                console.log(encrypted);

                var decrypted = encryption.decrypt(encrypted, nonceValue);
                console.log(decrypted);*/

                $('.resultPlaceholder').html('readable string: '+readableString+'<br>');
                $('.resultPlaceholder').append('javascript: encrypted: '+encrypted+'<br>');
                $('.resultPlaceholder').append('javascript: decrypted: '+decrypted+'<br>');
            });
        </script>
	</body>
</html>