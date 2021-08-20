<?php
// https://gist.github.com/Tiriel/bff8b06cb3359bba5f9e9ba1f9fc52c0
/*define('AES_METHOD', 'aes-256-cbc');
$password = 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36';

function encrypt($message, $password)
{
    if (OPENSSL_VERSION_NUMBER <= 268443727) {
        throw new RuntimeException('OpenSSL Version too old, vulnerability to Heartbleed');
    }

    $iv_size        = openssl_cipher_iv_length(AES_METHOD);
    $iv             = openssl_random_pseudo_bytes($iv_size);
    $cipher_text     = openssl_encrypt($message, AES_METHOD, $password, OPENSSL_RAW_DATA, $iv);
    $cipher_text_hex = bin2hex($cipher_text);
    $iv_hex         = bin2hex($iv);
    return "$iv_hex:$cipher_text_hex";
}

function decrypt($ciphered, $password)
{
    $iv_size    = openssl_cipher_iv_length(AES_METHOD);
    $data       = explode(":", $ciphered);
    $iv         = hex2bin($data[0]);
    $cipher_text = hex2bin($data[1]);
    return openssl_decrypt($cipher_text, AES_METHOD, $password, OPENSSL_RAW_DATA, $iv);
}

$text = 'bonzer@2017';
$encrypted = encrypt($text);
$decrypted = decrypt($encrypted);

echo $text.'<br/>';
echo 'Encrypted '.$encrypted.'<br/>';
echo 'Decrypted '.$decrypted.'<br/>';*/

// This is working with node js code
// https://gist.github.com/rojan/9545706
define('blockSize', 16);
define('encryptKey', 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36');
define('iv', '1234567890123456');

/*function decrypt($data)
{
    $str = mcrypt_decrypt(MCRYPT_RIJNDAEL_128,
        encryptKey,
        hex2bin($data),
        MCRYPT_MODE_CBC, iv);

    $len = mb_strlen($str);
    $pad = ord( $str[$len - 1] );
    if ($pad && $pad < blockSize) {
        $pm = preg_match('/' . chr($pad) . '{' . $pad . '}$/', $str);
        if( $pm ) {
            return mb_substr($str, 0, $len - $pad);
        }
    }

    return $str;
}

function encrypt($data)
{
    //don't use default php padding which is '\0'
    $pad = blockSize - (strlen($data) % blockSize);
    $data = $data . str_repeat(chr($pad), $pad);
    $str = mcrypt_encrypt(MCRYPT_RIJNDAEL_128,
        encryptKey,
        $data, MCRYPT_MODE_CBC, iv);
    return bin2hex($str);
}*/

function decrypt($data)
{
    /*$key = hex2bin("0123456789abcdef0123456789abcdef");
    $iv =  hex2bin("abcdef9876543210abcdef9876543210");

    $decrypted = openssl_decrypt($data, 'AES-128-CBC', $key, OPENSSL_ZERO_PADDING, $iv);

    $decrypted = trim($decrypted); // you have to trim it according to https://stackoverflow.com/a/29511152

    return $decrypted;*/

    $str = openssl_decrypt(hex2bin($data),
        'AES-256-CBC',
        encryptKey,
        null, iv);

    $len = mb_strlen($str);
    $pad = ord( $str[$len - 1] );
    if ($pad && $pad < blockSize) {
        $pm = preg_match('/' . chr($pad) . '{' . $pad . '}$/', $str);
        if( $pm ) {
            return mb_substr($str, 0, $len - $pad);
        }
    }

    return $str;
}

function encrypt($data)
{
    //don't use default php padding which is '\0'
//    $pad = blockSize - (strlen($data) % blockSize);
//    $data = $data . str_repeat(chr($pad), $pad);

    /*$str = openssl_encrypt($data,'AES-128-CBC',
        encryptKey,
        OPENSSL_RAW_DATA, iv);*/

    $str = openssl_encrypt($data, 'AES-256-CBC',
        encryptKey,
        null,
        iv);

    return bin2hex($str);
}

$text = 'bonzer@2017';
$encrypted = encrypt($text);
$decrypted = decrypt($encrypted);

/*define('blockSize', 64);
define('iterations', 100);
define('iv', '1234567890123456');
define('passphrase', 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36');
define('salt', 'C0d(a/(}$x7NzE!=Bl6eTFoG./`l2]N*{=O_C0clyhnbU*w.NZ:|fp;^Kt#*E@U!');

function CryptoJSAesEncrypt($plainText){

    $key = hash_pbkdf2('sha512', passphrase, salt, iterations, blockSize);

    $encryptedString = openssl_encrypt($plainText, 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    $encryptedString = base64_encode($encryptedString);

    return base64_encode(json_encode($encryptedString));

    return $encryptedString;

    $output = ['ciphertext' => $encryptedString, 'iv' => bin2hex(iv), 'salt' => bin2hex(salt), 'iterations' => iterations];

    return base64_encode(json_encode($output));

    $key = hash_pbkdf2("sha512", passphrase, salt, iterations, blockSize);

    $encrypted_data = openssl_encrypt($plainText, 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    //return bin2hex($encrypted_data);
    return $encrypted_data;
    //return base64_encode($encrypted_data);
}

function CryptoJSAesDecrypt($encryptedString)
{
    $cipherText = hex2bin($encryptedString);

    $key = hash_pbkdf2("sha512", passphrase, salt, iterations, blockSize);

    $decrypted= openssl_decrypt($cipherText , 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    return $decrypted;
}*/

/*function CryptoJSAesEncrypt($plainText) {
    $key = hash_pbkdf2('sha512', passphrase, salt, iterations, blockSize);

    $encryptedString = openssl_encrypt($plainText, 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    $encryptedString = base64_encode($encryptedString);

    return base64_encode(json_encode($encryptedString));

    return $encryptedString;

    $output = ['ciphertext' => $encryptedString, 'iv' => bin2hex(iv), 'salt' => bin2hex(salt), 'iterations' => iterations];

    return base64_encode(json_encode($output));

    $key = hash_pbkdf2("sha512", passphrase, salt, iterations, blockSize);

    $encrypted_data = openssl_encrypt($plainText, 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    //return bin2hex($encrypted_data);
    return $encrypted_data;
    //return base64_encode($encrypted_data);
}

$keySize = 256;
$ivSize = 128;
$iterations = 100;
$password = "Secret Password";

$text = 'Hello World';

$encrypted = CryptoJSAesEncrypt($text);
$decrypted = '';//CryptoJSAesDecrypt($encrypted);*/

define('blockSize', 64);
define('iterations', 999);
define('iv', '1234567890123456');
define('passphrase', 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36');
define('salt', 'C0d(a/(}$x7NzE!=Bl6eTFoG./`l2]N*{=O_C0clyhnbU*w.NZ:|fp;^Kt#*E@U!');

function CryptoJSAesEncrypt($plainText)
{
    $key = hash_pbkdf2("sha512", passphrase, salt, iterations, blockSize);

    $encrypted_data = openssl_encrypt($plainText, 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    return bin2hex($encrypted_data);
    //return $encrypted_data;
    //return base64_encode($encrypted_data);
}

function CryptoJSAesDecrypt($encryptedString)
{
    $cipherText = hex2bin($encryptedString);

    $key = hash_pbkdf2("sha512", passphrase, salt, iterations, blockSize);

    $decrypted= openssl_decrypt($cipherText , 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, iv);

    return $decrypted;
}

$text = 'bonzer@2017';

$encrypted = CryptoJSAesEncrypt($text);
$decrypted = CryptoJSAesDecrypt($encrypted);
?>
<html>
<head>
    <title>Crypto Test</title>
</head>
<body>
<h1>Crypto Text</h1>
<p>
    <div><span>Text : </span><?php echo $text; ?></div>
    <div><span>Encrypted : </span><?php echo $encrypted; ?></div>
    <div><span>Decrypted : </span><?php echo $decrypted; ?></div>
</p>
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="crypto-js/crypto-js.js"></script>
<script type="text/javascript">
    function CryptoJSAesDecrypt(encryptedString)
    {
        var blockSize = 64,
            iterations = 999,
            iv = '1234567890123456',
            passphrase = 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36',
            salt = 'C0d(a/(}$x7NzE!=Bl6eTFoG./`l2]N*{=O_C0clyhnbU*w.NZ:|fp;^Kt#*E@U!';

        var encryptedString = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));

        /*encryptedString = CryptoJS.enc.Hex.parse(encryptedString);

        console.log(encryptedString);*/

        var hashKey = CryptoJS.PBKDF2(passphrase, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (blockSize/8), 'iterations': iterations});

        var decrypted = CryptoJS.AES.decrypt(encryptedString, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    console.log(CryptoJSAesDecrypt('<?php echo $encrypted?>'));
</script>
</body>
</html>
