<?php
$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
$query = $pdo->query('SELECT sender_name, sender_address FROM mail_addresses');
$result = $query->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($result));
?>