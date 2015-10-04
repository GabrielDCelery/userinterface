<?php

$postdata = file_get_contents("php://input");
$decodedpostdata = json_decode($postdata);

$company_name = $decodedpostdata->companyName;
$receiving_date = $decodedpostdata->receivingDate;
$list_of_mails = $decodedpostdata->mails;

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$querystring_1 = 'SELECT id FROM companies WHERE companies.company_name = "' . $company_name . '"';
$query = $pdo->query($querystring_1);
$results = $query->fetchAll(PDO::FETCH_ASSOC);
$company_id = $results[0]["id"];

foreach($list_of_mails as $mail){
	$sender_name = $mail->senderName;
	$sender_address = $mail->senderAddress;

	$querystring = 'INSERT INTO mailing (company_id, sender_name, sender_address, receiving_date) VALUES ';
	$querystring .= '("' . $company_id . '", "' . $sender_name . '", "' . $sender_address . '", "' . $receiving_date . '")';

	$pdo->exec($querystring);
}

echo("Email(s) added successfully");

?>