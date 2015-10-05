<?php

header('Content-type: text/html; charset=UTF-8');

$host = "localhost";
$dbname = "practice_companies";

$username = "root";
$password = null;

date_default_timezone_set("Europe/Paris");

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

?>