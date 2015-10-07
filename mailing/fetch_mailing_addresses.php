<?php

require("../settings.php");

$query = $pdo->query('SELECT sender_name, sender_address FROM mail_addresses');
$result = $query->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($result));
?>