<?php

require("../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$forwarding_date = $request->forwarding_date;
$forwarding_method = $request->forwarding_method;
$id_list = $request->id;

if(!is_null($forwarding_date)){
	$forwarding_date = strtotime($forwarding_date);
	$forwarding_date = date('Y-m-d', $forwarding_date);
}

foreach($id_list as $id){
	$q = 'UPDATE mailing SET ';
	$q .= 'forwarding_date = "' . $forwarding_date . '", ';
	$q .= 'forwarding_method = "' . $forwarding_method . '"';
	$q .= ' WHERE id = ';
	$q .= $id;

	$pdo->query($q);
}

echo("Data successfully overwritten!");

?>