<?php

$host = "localhost";
$dbname = "practice_companies";

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$login_username = $request->userName;
$login_password = $request->password;

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$querystring = 'SELECT password FROM users WHERE username = "' . $login_username . '"';
$query = $pdo->query($querystring);
$results = $query->fetchAll(PDO::FETCH_ASSOC);

if($results != null){
	if($results[0]['password'] == $login_password){
		if(!isset($_SESSION)) { 
			session_start();
		}
		$_SESSION['login_username'] = $login_username;
		$_SESSION['login_password'] = $login_password;
		echo("Login successful!");
	} else {
		echo("Login unsuccessful!");
	}
} else {
	echo("Login unsuccessful!");
}

?>