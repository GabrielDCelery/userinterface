<?php

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
/*$pdo->exec("set names utf8");*/
$result = $pdo->query('SELECT id, company_name FROM companies');
$rows = $result->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($rows));
?>