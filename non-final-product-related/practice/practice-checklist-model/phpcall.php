<?php

$pdo = new PDO('mysql:dbname=test;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
/*$pdo->exec("set names utf8");*/
$result = $pdo->query('SELECT * FROM roles');
$rows = $result->fetchAll();
echo(json_encode($rows));

?>
