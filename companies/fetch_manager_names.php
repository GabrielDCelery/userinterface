<?php

require("../settings.php");

$querystring = 'SELECT DISTINCT manager_name FROM companies_detailed';
$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute();
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($results));

?>