<?php

$postdata = file_get_contents("php://input");
$requests = json_decode($postdata);

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

foreach($requests as $request){
	$mail_id = $request->mail_id;
	$sender_name = $request->sender_name;
	$sender_address = $request->sender_address;
	$receiving_date = $request->receiving_date;
	$forwarding_date = $request->forwarding_date;
	$forwarding_method = $request->forwarding_method;

	$q = 'UPDATE practice_companies.mailing SET ';
	$q .= 'sender_name = "' . $sender_name . '", ';
	$q .= 'sender_address = "' . $sender_address . '", ';
	$q .= 'receiving_date = "' . $receiving_date . '", ';
	$q .= 'forwarding_date = "' . $forwarding_date . '", ';
	$q .= 'forwarding_method = "' . $forwarding_method . '"';
	$q .= ' WHERE mailing.id = ';
	$q .= $mail_id;

	$pdo->query($q);
}

echo("Data successfully overwritten");

?>