<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$forwarding_date = $request->forwarding_date;
$forwarding_method = $request->forwarding_method;
$id_list = $request->id;

foreach($id_list as $id){
	$q = 'UPDATE mailing SET ';
	$q .= 'forwarding_date = "' . $forwarding_date . '", ';
	$q .= 'forwarding_method = "' . $forwarding_method . '"';
	$q .= ' WHERE id = ';
	$q .= $id;

	$pdo->query($q);
}

echo("Data has been successfully overwritten!");

?>