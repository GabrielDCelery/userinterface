<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$mail_id_list = $request->id;

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

foreach($mail_id_list as $mail_id){
	$q = 'DELETE FROM mailing WHERE id = ';
	$q .= $mail_id;
	$pdo->query($q);
}

echo("Data successfully overwritten!");

?>