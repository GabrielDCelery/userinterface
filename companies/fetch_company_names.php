<?php

require("../settings.php");

$querystring = 'SELECT company_name FROM companies';
$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute();
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($results));

/*
$result = $pdo->query('SELECT company_name FROM companies');

$rows = $result->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($rows));
*/
?>