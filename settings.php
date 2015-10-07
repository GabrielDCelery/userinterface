<?php

header('Content-type: text/html; charset=UTF-8');

$host = "localhost";
$dbname = "practice_companies";

if(!isset($_SESSION)) { 
	session_start();
}

if(isset($_SESSION['login_username'])){
	$username = $_SESSION['login_username'];
	$password = $_SESSION['login_password'];
}

date_default_timezone_set("Europe/Paris");

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

?>