<?php

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
$result = $pdo->query('SELECT starting_date FROM companies_detailed WHERE id = 6');
$rows = $result->fetchAll();
echo(json_encode($rows));

?>