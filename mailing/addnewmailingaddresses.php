<?php

$postdata = file_get_contents("php://input");
$list_of_mails = json_decode($postdata);

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

foreach($list_of_mails as $mail){
	$sender_name = $mail->senderName;
	$sender_address = $mail->senderAddress;

	$query = 'INSERT INTO mail_addresses (sender_name, sender_address) VALUES ';
	$query .= '("' . $sender_name . '", "' . $sender_address . '")';

	$pdo->exec($query);
}

echo("Emails added successfully");

?>