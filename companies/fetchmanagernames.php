<?php

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
$result = $pdo->query('SELECT DISTINCT manager_name FROM companies_detailed');
$rows = $result->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($rows));
?>