<?php

require("../settings.php");

$result = $pdo->query('SELECT DISTINCT manager_name FROM companies_detailed');
$rows = $result->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($rows));
?>